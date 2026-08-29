import { getChatGPTUser } from "@/app/chatgpt-auth";
import { authorizeOwnerContextV1 } from "@/src/server/authorize-owner-context.mjs";
import { getAuthenticatedCoreAccess } from "@/src/server/core-authenticated-access-client";
import { getOwnerOpsProjection } from "@/src/server/get-owner-ops-projection.mjs";
import { LiveOpsOwnerProjectionProvider } from "@/src/server/live-ops-owner-projection-provider.mjs";
import {
  OpsGrantIssuanceError,
  parseOpsGrantKeyring,
} from "@/src/server/ops-projection-grant.mjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const FORBIDDEN_AUTHORITY_INPUTS = [
  "account_id",
  "canonical_account_id",
  "ops_organization_id",
  "ops_shop_id",
  "entitlement",
  "membership",
  "auth_subject",
];

function json(body: unknown, status: number) {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function statusFor(result: Awaited<ReturnType<typeof getOwnerOpsProjection>>): number {
  if (result.authorization.state === "UNAUTHENTICATED") return 401;
  if (result.authorization.state !== "AUTHORIZED") return 403;
  if (result.data?.state === "LIVE" || result.data?.state === "STALE") return 200;
  if (result.data?.reason === "MAPPING_UNAVAILABLE") return 404;
  if (result.data?.reason === "MAPPING_INCONSISTENT") return 409;
  return 503;
}

function grantConfig() {
  const activeKid = process.env.ANLIEN_OPS_GRANT_ACTIVE_KID;
  const encodedKeys = process.env.ANLIEN_OPS_GRANT_KEYS_JSON;
  const issuer = process.env.ANLIEN_OPS_GRANT_ISSUER;
  if (!issuer) return null;
  try {
    return {
      issuer,
      ttlSeconds: 60,
      keyring: parseOpsGrantKeyring(activeKid, encodedKeys),
    };
  } catch (error) {
    if (!(error instanceof OpsGrantIssuanceError)) {
      // Never log runtime configuration or auth material.
    }
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (FORBIDDEN_AUTHORITY_INPUTS.some((key) => url.searchParams.has(key))) {
    return json({ error: "Authority identifiers are server-derived" }, 400);
  }

  const canonicalBusinessId = url.searchParams.get("business_id") ?? undefined;
  const canonicalLocationId = url.searchParams.get("location_id") ?? "";
  const projectionDate = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  if (
    (canonicalBusinessId && !UUID.test(canonicalBusinessId)) ||
    !UUID.test(canonicalLocationId) ||
    !DATE.test(projectionDate)
  ) {
    return json({ error: "Invalid canonical selection" }, 400);
  }

  const user = await getChatGPTUser();
  if (!user) {
    return json(
      {
        contract: "owner_ops_projection_composition.v1",
        authorization: { state: "UNAUTHENTICATED" },
        data: null,
      },
      401,
    );
  }

  const provider = new LiveOpsOwnerProjectionProvider({
    enabled: process.env.ANLIEN_OPS_LIVE_PROVIDER_ENABLED === "true",
    gatewayUrl: process.env.ANLIEN_OPS_GATEWAY_URL,
    grantConfig: grantConfig(),
  });
  const result = await getOwnerOpsProjection(
    {
      authSubject: user.userId,
      canonicalBusinessId,
      canonicalLocationId,
      projectionDate,
    },
    { getAuthenticatedCoreAccess, authorizeOwnerContextV1, provider },
  );
  return json(result, statusFor(result));
}
