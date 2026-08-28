import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { authorizeOwnerContextV1 } from "../src/server/authorize-owner-context.mjs";

const accountA = "43000000-0000-4000-8000-000000000001";
const businessA = "43000000-0000-4000-8000-000000000011";
const businessB = "43000000-0000-4000-8000-000000000012";
const locationA = "43000000-0000-4000-8000-000000000021";
const locationB = "43000000-0000-4000-8000-000000000022";

function authenticated(overrides = {}) {
  return {
    contract: "anlien_authenticated_access_context_v1",
    state: "AUTHENTICATED",
    session: {
      authenticated: true,
      canonical_account_id: accountA,
      auth_subject: "synthetic-site-subject",
      issued_at: null,
      expires_at: null,
    },
    access: {
      contract: "anlien_canonical_access_projection_v1",
      state: "AUTHENTICATED_AUTHORIZED",
      generated_at: "2026-08-28T00:00:00.000Z",
      account: { id: accountA, status: "active" },
      businesses: [
        { id: businessA, organization_id: "org-a", display_name: "A", status: "active" },
      ],
      memberships: [
        { id: "membership-a", account_id: accountA, business_id: businessA, status: "active" },
      ],
      entitlements: [
        { id: "ops-a", business_id: businessA, product: "ops", status: "active", available: true },
      ],
      locations: [
        { id: locationA, business_id: businessA, display_name: "A1", status: "active" },
        { id: locationB, business_id: businessB, display_name: "B1", status: "active" },
      ],
    },
    ...overrides,
  };
}

test("authorizes only the Account, Business, Entitlement, and Location from Core", () => {
  const result = authorizeOwnerContextV1(authenticated(), {
    canonicalBusinessId: businessA,
    canonicalLocationId: locationA,
  });
  assert.equal(result.state, "AUTHORIZED");
  assert.equal(result.context.canonicalAccountId, accountA);
  assert.equal(result.context.canonicalBusinessId, businessA);
  assert.deepEqual(result.context.canonicalLocationIds, [locationA]);
  assert.deepEqual(result.context.productEntitlements, ["ops"]);
});

test("preserves explicit authentication failures", () => {
  for (const state of [
    "UNAUTHENTICATED",
    "SESSION_INVALID",
    "SESSION_EXPIRED",
    "ACCOUNT_NOT_LINKED",
    "ACCOUNT_INACTIVE",
    "AMBIGUOUS_ACCOUNT",
  ]) {
    const result = authorizeOwnerContextV1({
      contract: "anlien_authenticated_access_context_v1",
      state,
      session: null,
      access: null,
    });
    assert.equal(result.state, state);
    assert.equal(result.context, null);
  }
});

test("denies Business hopping and mismatched Account projections", () => {
  assert.equal(
    authorizeOwnerContextV1(authenticated(), { canonicalBusinessId: businessB }).state,
    "NO_MEMBERSHIP",
  );
  const mismatched = authenticated();
  mismatched.access.account.id = "43000000-0000-4000-8000-000000000099";
  assert.equal(authorizeOwnerContextV1(mismatched).state, "CANONICAL_ACCESS_UNAVAILABLE");
});

test("denies cross-Business Location and missing Ops Entitlement", () => {
  assert.equal(
    authorizeOwnerContextV1(authenticated(), {
      canonicalBusinessId: businessA,
      canonicalLocationId: locationB,
    }).state,
    "LOCATION_NOT_AUTHORIZED",
  );
  const noOps = authenticated();
  noOps.access.entitlements[0] = {
    id: "loyalty-a",
    business_id: businessA,
    product: "loyalty",
    status: "active",
    available: true,
  };
  assert.equal(authorizeOwnerContextV1(noOps).state, "NO_ENTITLEMENT");
});

test("keeps browser authority parameters and privileged credentials out of the transport", async () => {
  const [route, client, adapter, auth] = await Promise.all([
    readFile(new URL("../app/api/access-context/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/server/core-authenticated-access-client.ts", import.meta.url), "utf8"),
    readFile(new URL("../src/adapters/core-access-context-adapter.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/chatgpt-auth.ts", import.meta.url), "utf8"),
  ]);

  assert.match(auth, /oai-authenticated-user-id/);
  assert.match(route, /getChatGPTUser\(\)/);
  assert.match(route, /ANLIEN_AUTH_TRANSPORT !== "openai_sites_dispatcher"/);
  for (const forbidden of [
    "account_id",
    "canonical_account_id",
    "ops_organization_id",
    "ops_shop_id",
  ]) {
    assert.match(route, new RegExp(`"${forbidden}"`));
  }
  assert.match(route, /cache-control": "private, no-store"/);
  assert.match(client, /process\.env\.ANLIEN_CORE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(`${route}\n${client}`, /NEXT_PUBLIC_.*(SERVICE|AUTH_TRANSPORT)|console\.(log|error)|email/i);
  assert.doesNotMatch(adapter, /authorization|apikey|service.role|source_entity_id/i);
  assert.doesNotMatch(`${route}\n${client}`, /demoAccessContext|privateAccessScenarios/);
});
