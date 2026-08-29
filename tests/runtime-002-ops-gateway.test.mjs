import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CoreOpsMappingError } from "../src/server/core-ops-mapping-client.mjs";
import { getOwnerOpsProjection } from "../src/server/get-owner-ops-projection.mjs";
import {
  LiveOpsOwnerProjectionProvider,
  isOpsOwnerProjectionV1,
} from "../src/server/live-ops-owner-projection-provider.mjs";
import {
  encodeBase64Url,
  mintOpsProjectionAccessGrantV1,
} from "../src/server/ops-projection-grant.mjs";

const NOW = new Date("2026-08-28T10:00:00.000Z");
const context = {
  canonicalAccountId: "11111111-1111-4111-8111-111111111111",
  canonicalBusinessId: "22222222-2222-4222-8222-222222222222",
  canonicalLocationIds: ["33333333-3333-4333-8333-333333333333"],
  productEntitlements: ["ops"],
};
const mapping = {
  contract: "anlien_canonical_ops_mapping_v1",
  resolver: "canonical_location_to_ops_shop",
  state: "VERIFIED",
  mapping_status: "VERIFIED",
  canonical_business_id: context.canonicalBusinessId,
  canonical_location_id: context.canonicalLocationIds[0],
  ops_organization_id: "44444444-4444-4444-8444-444444444444",
  ops_shop_id: "55555555-5555-4555-8555-555555555555",
  mapping_ref_id: "77777777-7777-4777-8777-777777777777",
  verified_at: NOW.toISOString(),
};
const grantConfig = {
  issuer: "anlien-shell-test",
  ttlSeconds: 60,
  keyring: {
    activeKid: "test-2026-08",
    keys: {
      "test-2026-08": encodeBase64Url(
        new TextEncoder().encode("runtime-002-test-key-material-32-bytes-minimum"),
      ),
    },
  },
};

function projection(overrides = {}) {
  return {
    contract: "ops_owner_projection.v1",
    owner: "ops",
    generatedAt: NOW.toISOString(),
    projectionDate: "2026-08-28",
    freshness: { status: "live", asOf: NOW.toISOString() },
    source: { organizationId: mapping.ops_organization_id },
    canonical: { businessId: context.canonicalBusinessId },
    health: "healthy",
    totals: {
      staffScheduledToday: 0,
      staffCheckedInToday: 0,
      staffLateToday: 0,
      tasksTotalToday: 0,
      tasksCompletedToday: 0,
      tasksOverdue: 0,
      tasksPendingReview: 0,
    },
    locations: [
      {
        sourceLocationId: mapping.ops_shop_id,
        anlienLocationId: context.canonicalLocationIds[0],
        name: "MUA cafe",
        attendance: { scheduledToday: 0, checkedInToday: 0, lateToday: 0 },
        tasks: { totalToday: 0, completedToday: 0, overdue: 0, pendingReview: 0 },
      },
    ],
    actions: [],
    ...overrides,
  };
}

function provider(overrides = {}) {
  return new LiveOpsOwnerProjectionProvider({
    enabled: true,
    gatewayUrl: "https://ops.test/functions/v1/owner-projection-gateway",
    grantConfig,
    now: () => NOW,
    mappingResolver: async () => mapping,
    fetchImpl: async () => Response.json(projection()),
    ...overrides,
  });
}

const request = {
  authorizedContext: context,
  canonicalLocationId: context.canonicalLocationIds[0],
  projectionDate: "2026-08-28",
};

test("mints only a 60-second grant from authorized context and VERIFIED mapping", async () => {
  const { assertion, claims } = await mintOpsProjectionAccessGrantV1(
    { ...request, mapping },
    grantConfig,
    { now: NOW, jti: "66666666-6666-4666-8666-666666666666" },
  );
  assert.equal(assertion.split(".").length, 3);
  assert.deepEqual(claims, {
    contract: "ops_projection_access_grant.v1",
    version: 1,
    issuer: "anlien-shell-test",
    audience: "ops-owner-projection-gateway",
    canonicalAccountId: context.canonicalAccountId,
    canonicalBusinessId: context.canonicalBusinessId,
    canonicalLocationId: context.canonicalLocationIds[0],
    opsOrganizationId: mapping.ops_organization_id,
    opsShopId: mapping.ops_shop_id,
    entitlement: "ops",
    projectionDate: "2026-08-28",
    issuedAt: NOW.toISOString(),
    expiresAt: new Date(NOW.getTime() + 60_000).toISOString(),
    jti: "66666666-6666-4666-8666-666666666666",
  });
});

test("returns LIVE and STALE only for a contract-validated Ops response", async () => {
  const live = await provider().getOwnerProjection(request);
  assert.equal(live.state, "LIVE");
  assert.equal(live.projection.totals.tasksTotalToday, 0);

  const stale = await provider({
    fetchImpl: async () =>
      Response.json(projection({ freshness: { status: "stale", asOf: NOW.toISOString() } })),
  }).getOwnerProjection(request);
  assert.equal(stale.state, "STALE");
});

test("fails closed for unverified mapping, no entitlement, and cross-location scope", async () => {
  let gatewayCalls = 0;
  const unverified = provider({
    mappingResolver: async () => {
      throw new CoreOpsMappingError("MAPPING_UNAVAILABLE", "PARENT_NOT_VERIFIED");
    },
    fetchImpl: async () => {
      gatewayCalls += 1;
      return Response.json(projection());
    },
  });
  assert.deepEqual(await unverified.getOwnerProjection(request), {
    contract: "owner_ops_projection_result.v1",
    state: "UNAVAILABLE",
    projection: null,
    reason: "MAPPING_UNAVAILABLE",
  });
  assert.equal(gatewayCalls, 0);

  const noEntitlement = await provider().getOwnerProjection({
    ...request,
    authorizedContext: { ...context, productEntitlements: [] },
  });
  assert.equal(noEntitlement.reason, "GATEWAY_AUTHORIZATION_FAILED");
  const crossLocation = await provider().getOwnerProjection({
    ...request,
    canonicalLocationId: "88888888-8888-4888-8888-888888888888",
  });
  assert.equal(crossLocation.reason, "GATEWAY_AUTHORIZATION_FAILED");
});

test("separates unavailable, malformed/version mismatch, and leaked responses", async () => {
  const unavailable = await provider({
    fetchImpl: async () => Response.json({ code: "projection_unavailable" }, { status: 503 }),
  }).getOwnerProjection(request);
  assert.equal(unavailable.state, "UNAVAILABLE");

  const mismatch = await provider({
    fetchImpl: async () => Response.json(projection({ contract: "ops_owner_projection.v2" })),
  }).getOwnerProjection(request);
  assert.equal(mismatch.reason, "CONTRACT_MISMATCH");

  const leaked = await provider({
    fetchImpl: async () => Response.json({ ...projection(), email: "owner@example.test" }),
  }).getOwnerProjection(request);
  assert.equal(leaked.reason, "CONTRACT_MISMATCH");
});

test("composition never invokes the provider for failed canonical authorization", async () => {
  let providerCalls = 0;
  const result = await getOwnerOpsProjection(
    {
      authSubject: "trusted-subject",
      canonicalBusinessId: context.canonicalBusinessId,
      canonicalLocationId: context.canonicalLocationIds[0],
      projectionDate: "2026-08-28",
    },
    {
      getAuthenticatedCoreAccess: async () => ({ contract: "core" }),
      authorizeOwnerContextV1: () => ({ state: "NO_ENTITLEMENT" }),
      provider: {
        async getOwnerProjection() {
          providerCalls += 1;
        },
      },
    },
  );
  assert.equal(result.authorization.state, "NO_ENTITLEMENT");
  assert.equal(result.data, null);
  assert.equal(providerCalls, 0);
});

test("composition passes only trusted AuthorizedOwnerContext to the provider", async () => {
  const result = await getOwnerOpsProjection(
    {
      authSubject: "trusted-subject",
      canonicalBusinessId: context.canonicalBusinessId,
      canonicalLocationId: context.canonicalLocationIds[0],
      projectionDate: "2026-08-28",
    },
    {
      getAuthenticatedCoreAccess: async () => ({ contract: "core" }),
      authorizeOwnerContextV1: () => ({ state: "AUTHORIZED", context }),
      provider: provider(),
    },
  );
  assert.equal(result.authorization.state, "AUTHORIZED");
  assert.equal(result.data.state, "LIVE");
});

test("validator rejects source/canonical tenant mismatch and sensitive fields", () => {
  const expected = {
    projectionDate: "2026-08-28",
    opsOrganizationId: mapping.ops_organization_id,
    opsShopId: mapping.ops_shop_id,
    canonicalBusinessId: context.canonicalBusinessId,
    canonicalLocationId: context.canonicalLocationIds[0],
  };
  assert.equal(isOpsOwnerProjectionV1(projection(), expected), true);
  assert.equal(
    isOpsOwnerProjectionV1(
      projection({ source: { organizationId: "99999999-9999-4999-8999-999999999999" } }),
      expected,
    ),
    false,
  );
  assert.equal(isOpsOwnerProjectionV1({ ...projection(), selfie_url: "secret" }, expected), false);
});

test("route and provider reject browser authority and never expose privileged material", () => {
  const route = readFileSync("app/api/ops-owner-projection/route.ts", "utf8");
  const providerSource = readFileSync(
    "src/server/live-ops-owner-projection-provider.mjs",
    "utf8",
  );
  assert.match(route, /account_id/);
  assert.match(route, /ops_organization_id/);
  assert.match(route, /ops_shop_id/);
  assert.match(route, /ANLIEN_OPS_LIVE_PROVIDER_ENABLED === "true"/);
  assert.doesNotMatch(route + providerSource, /NEXT_PUBLIC_|VITE_.*SERVICE|console\.log/);
});
