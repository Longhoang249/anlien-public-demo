import { CoreOpsMappingError, resolveVerifiedOpsLocationMapping } from "./core-ops-mapping-client.mjs";
import {
  OpsGrantIssuanceError,
  mintOpsProjectionAccessGrantV1,
} from "./ops-projection-grant.mjs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const FORBIDDEN_KEYS = new Set([
  "email",
  "selfie_url",
  "selfieUrl",
  "latitude",
  "longitude",
  "evidence",
  "raw_memberships",
  "raw_tasks",
  "service_role",
  "auth_subject",
]);

function failure(state, reason) {
  return { contract: "owner_ops_projection_result.v1", state, projection: null, reason };
}

function containsForbidden(value) {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(containsForbidden);
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key) || containsForbidden(child)) return true;
  }
  return false;
}

function nonnegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

export function isOpsOwnerProjectionV1(value, expected) {
  if (
    !value ||
    value.contract !== "ops_owner_projection.v1" ||
    value.owner !== "ops" ||
    value.projectionDate !== expected.projectionDate ||
    value.source?.organizationId !== expected.opsOrganizationId ||
    value.canonical?.businessId !== expected.canonicalBusinessId ||
    !["live", "stale"].includes(value.freshness?.status) ||
    !Number.isFinite(Date.parse(value.generatedAt)) ||
    !Number.isFinite(Date.parse(value.freshness.asOf)) ||
    !["healthy", "attention"].includes(value.health) ||
    !Array.isArray(value.locations) ||
    value.locations.length !== 1 ||
    !Array.isArray(value.actions) ||
    containsForbidden(value)
  ) {
    return false;
  }
  const location = value.locations[0];
  if (
    location.sourceLocationId !== expected.opsShopId ||
    location.anlienLocationId !== expected.canonicalLocationId ||
    typeof location.name !== "string"
  ) {
    return false;
  }
  return [
    value.totals?.staffScheduledToday,
    value.totals?.staffCheckedInToday,
    value.totals?.staffLateToday,
    value.totals?.tasksTotalToday,
    value.totals?.tasksCompletedToday,
    value.totals?.tasksOverdue,
    value.totals?.tasksPendingReview,
    location.attendance?.scheduledToday,
    location.attendance?.checkedInToday,
    location.attendance?.lateToday,
    location.tasks?.totalToday,
    location.tasks?.completedToday,
    location.tasks?.overdue,
    location.tasks?.pendingReview,
  ].every(nonnegativeInteger);
}

export class LiveOpsOwnerProjectionProvider {
  constructor(config = {}) {
    this.enabled = config.enabled ?? false;
    this.gatewayUrl = config.gatewayUrl;
    this.fetchImpl = config.fetchImpl ?? fetch;
    this.mappingResolver = config.mappingResolver ?? resolveVerifiedOpsLocationMapping;
    this.grantIssuer = config.grantIssuer ?? mintOpsProjectionAccessGrantV1;
    this.grantConfig = config.grantConfig;
    this.now = config.now ?? (() => new Date());
  }

  async getOwnerProjection(input) {
    if (!this.enabled || !this.gatewayUrl || !this.grantConfig) {
      return failure("UNAVAILABLE", "LIVE_PROVIDER_DISABLED");
    }
    const context = input.authorizedContext;
    if (
      !context ||
      !UUID.test(input.canonicalLocationId ?? "") ||
      !context.canonicalLocationIds?.includes(input.canonicalLocationId) ||
      !context.productEntitlements?.includes("ops")
    ) {
      return failure("ERROR", "GATEWAY_AUTHORIZATION_FAILED");
    }

    let mapping;
    try {
      mapping = await this.mappingResolver({
        canonicalBusinessId: context.canonicalBusinessId,
        canonicalLocationId: input.canonicalLocationId,
      });
    } catch (error) {
      if (error instanceof CoreOpsMappingError && error.reason === "MAPPING_INCONSISTENT") {
        return failure("ERROR", "MAPPING_INCONSISTENT");
      }
      return failure("UNAVAILABLE", "MAPPING_UNAVAILABLE");
    }

    let assertion;
    try {
      ({ assertion } = await this.grantIssuer(
        {
          authorizedContext: context,
          canonicalLocationId: input.canonicalLocationId,
          projectionDate: input.projectionDate,
          mapping,
        },
        this.grantConfig,
        { now: this.now() },
      ));
    } catch (error) {
      if (error instanceof OpsGrantIssuanceError && error.code === "VERIFIED_MAPPING_REQUIRED") {
        return failure("ERROR", "MAPPING_INCONSISTENT");
      }
      return failure("ERROR", "GATEWAY_AUTHORIZATION_FAILED");
    }

    let response;
    try {
      response = await this.fetchImpl(this.gatewayUrl, {
        method: "POST",
        headers: {
          authorization: `Bearer ${assertion}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({ contract: "ops_owner_projection_request.v1" }),
        cache: "no-store",
        signal: AbortSignal.timeout(5_000),
      });
    } catch {
      return failure("UNAVAILABLE", "GATEWAY_UNAVAILABLE");
    }
    if (response.status === 401 || response.status === 403) {
      return failure("ERROR", "GATEWAY_AUTHORIZATION_FAILED");
    }
    if (response.status === 409) return failure("ERROR", "MAPPING_INCONSISTENT");
    if (response.status === 422) return failure("ERROR", "CONTRACT_MISMATCH");
    if (!response.ok) return failure("UNAVAILABLE", "GATEWAY_UNAVAILABLE");

    let projection;
    try {
      projection = await response.json();
    } catch {
      return failure("ERROR", "CONTRACT_MISMATCH");
    }
    if (
      !isOpsOwnerProjectionV1(projection, {
        projectionDate: input.projectionDate,
        opsOrganizationId: mapping.ops_organization_id,
        opsShopId: mapping.ops_shop_id,
        canonicalBusinessId: context.canonicalBusinessId,
        canonicalLocationId: input.canonicalLocationId,
      })
    ) {
      return failure("ERROR", "CONTRACT_MISMATCH");
    }
    return {
      contract: "owner_ops_projection_result.v1",
      state: projection.freshness.status === "stale" ? "STALE" : "LIVE",
      projection,
      reason: null,
    };
  }
}
