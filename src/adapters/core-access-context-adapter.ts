import type { CoreAccessContextAdapterContract } from "@/src/contracts/access-context";
import type {
  CoreAccessProjectionRequest,
  CoreAccessProjectionV1,
} from "@/src/contracts/core-access-api";
import type {
  AccessContext,
  AccessFailureReason,
  ProductKey,
} from "@/src/contracts/shell";

interface CoreAccessContextAdapterConfig {
  enabled?: boolean;
  endpoint?: string;
  source?: CoreAccessProjectionRequest;
  fetchImpl?: typeof fetch;
  staleAfterMs?: number;
}

const products: ProductKey[] = ["marketing", "loyalty", "ops"];

function failedContext(failure: AccessFailureReason): AccessContext {
  return {
    mode: "SIGNED_IN_PLACEHOLDER",
    account: null,
    businesses: [],
    selectedBusinessId: null,
    source: "core",
    health: failure === "core_unavailable" ? "unavailable" : "error",
    failure,
    generatedAt: new Date().toISOString(),
  };
}

function isProjection(value: unknown): value is CoreAccessProjectionV1 {
  if (!value || typeof value !== "object") return false;
  const projection = value as Partial<CoreAccessProjectionV1>;
  if (
    projection.contract !== "anlien_access_projection_v1" ||
    typeof projection.generated_at !== "string" ||
    !["READY", "ACCOUNT_UNRESOLVED", "ACCOUNT_INACTIVE", "NO_ACTIVE_MEMBERSHIP"].includes(
      projection.state ?? "",
    ) ||
    !Array.isArray(projection.businesses)
  ) {
    return false;
  }

  return projection.businesses.every((entry) =>
    Boolean(
      entry?.business?.id &&
        entry.business.organization_id &&
        entry.business.display_name &&
        entry.business.status === "active" &&
        entry.membership?.id &&
        entry.membership.status === "active" &&
        Array.isArray(entry.products) &&
        entry.products.length === products.length &&
        products.every((product) =>
          entry.products.some(
            (candidate) =>
              candidate.product === product &&
              ["active", "inactive", "missing"].includes(candidate.entitlement_status) &&
              typeof candidate.available === "boolean",
          ),
        ),
    ),
  );
}

export class CoreAccessContextAdapter implements CoreAccessContextAdapterContract {
  readonly kind = "core-access-context" as const;
  readonly enabled: boolean;
  private readonly endpoint?: string;
  private readonly source?: CoreAccessProjectionRequest;
  private readonly fetchImpl: typeof fetch;
  private readonly staleAfterMs: number;

  constructor(config: CoreAccessContextAdapterConfig = {}) {
    this.enabled = config.enabled ?? false;
    this.endpoint = config.endpoint;
    this.source = config.source;
    this.fetchImpl = config.fetchImpl ?? fetch;
    this.staleAfterMs = config.staleAfterMs ?? 5 * 60 * 1000;
  }

  async getAccessContext(): Promise<AccessContext> {
    if (!this.enabled) return failedContext("not_authenticated");
    if (!this.endpoint || !this.source) return failedContext("adapter_error");

    try {
      const response = await this.fetchImpl(this.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(this.source),
        cache: "no-store",
      });
      if (!response.ok) return failedContext("core_unavailable");

      const projection: unknown = await response.json();
      if (!isProjection(projection)) return failedContext("invalid_response");
      if (projection.state === "ACCOUNT_UNRESOLVED") return failedContext("not_authenticated");
      if (projection.state === "ACCOUNT_INACTIVE") return failedContext("not_member");
      if (projection.state === "NO_ACTIVE_MEMBERSHIP") return failedContext("not_member");
      if (!projection.account) return failedContext("invalid_response");

      const generatedAt = Date.parse(projection.generated_at);
      const stale = !Number.isFinite(generatedAt) || Date.now() - generatedAt > this.staleAfterMs;
      const businesses = projection.businesses.map((entry) => ({
        business: {
          id: entry.business.id,
          organizationId: entry.business.organization_id,
          name: entry.business.display_name,
          status: entry.business.status,
          synthetic: false,
        },
        membership: {
          id: entry.membership.id,
          accountId: projection.account!.id,
          businessId: entry.business.id,
          status: entry.membership.status,
        },
        entitlements: entry.products.map((product) => ({
          id: product.entitlement_id ?? `missing-${entry.business.id}-${product.product}`,
          businessId: entry.business.id,
          product: product.product,
          status: product.entitlement_status,
        })),
      }));

      return {
        mode: "PRIVATE_WORKSPACE",
        account: {
          id: projection.account.id,
          label: "ANLIEN Account",
          status: projection.account.status,
          synthetic: false,
        },
        businesses,
        selectedBusinessId: businesses[0]?.business.id ?? null,
        source: "core",
        health: stale ? "stale" : "live",
        failure: businesses.some((business) =>
          business.entitlements.some((entitlement) => entitlement.status === "active"),
        )
          ? "none"
          : "not_entitled",
        generatedAt: projection.generated_at,
      };
    } catch {
      return failedContext("adapter_error");
    }
  }
}

// Activation requires an explicit trusted endpoint and exact source tuple.
// The public demo never enables this instance and never carries Core credentials.
export const coreAccessContextAdapter = new CoreAccessContextAdapter({ enabled: false });
