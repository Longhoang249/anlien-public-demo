import type { CoreAccessContextAdapterContract } from "@/src/contracts/access-context";
import type { AuthorizedOwnerContextEnvelopeV1 } from "@/src/contracts/core-access-api";
import type { AccessContext, AccessFailureReason } from "@/src/contracts/shell";

interface CoreAccessContextAdapterConfig {
  enabled?: boolean;
  endpoint?: string;
  fetchImpl?: typeof fetch;
  staleAfterMs?: number;
}

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

function mapFailure(state: AuthorizedOwnerContextEnvelopeV1["state"]): AccessFailureReason {
  if (state === "UNAUTHENTICATED" || state === "SESSION_INVALID" || state === "SESSION_EXPIRED") {
    return "not_authenticated";
  }
  if (
    state === "ACCOUNT_NOT_LINKED" ||
    state === "ACCOUNT_INACTIVE" ||
    state === "AMBIGUOUS_ACCOUNT" ||
    state === "NO_MEMBERSHIP" ||
    state === "LOCATION_NOT_AUTHORIZED"
  ) {
    return "not_member";
  }
  if (state === "NO_ENTITLEMENT") return "not_entitled";
  if (state === "CANONICAL_ACCESS_UNAVAILABLE") return "core_unavailable";
  return "invalid_response";
}

function isEnvelope(value: unknown): value is AuthorizedOwnerContextEnvelopeV1 {
  if (!value || typeof value !== "object") return false;
  const envelope = value as Partial<AuthorizedOwnerContextEnvelopeV1>;
  return envelope.contract === "authorized_owner_context.v1" && typeof envelope.state === "string";
}

export class CoreAccessContextAdapter implements CoreAccessContextAdapterContract {
  readonly kind = "core-access-context" as const;
  readonly enabled: boolean;
  private readonly endpoint?: string;
  private readonly fetchImpl: typeof fetch;
  private readonly staleAfterMs: number;

  constructor(config: CoreAccessContextAdapterConfig = {}) {
    this.enabled = config.enabled ?? false;
    this.endpoint = config.endpoint;
    this.fetchImpl = config.fetchImpl ?? fetch;
    this.staleAfterMs = config.staleAfterMs ?? 5 * 60 * 1000;
  }

  async getAccessContext(): Promise<AccessContext> {
    if (!this.enabled) return failedContext("not_authenticated");
    if (!this.endpoint) return failedContext("adapter_error");

    try {
      const response = await this.fetchImpl(this.endpoint, {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) return failedContext(response.status === 401 ? "not_authenticated" : "core_unavailable");

      const envelope: unknown = await response.json();
      if (!isEnvelope(envelope)) return failedContext("invalid_response");
      if (envelope.state !== "AUTHORIZED") return failedContext(mapFailure(envelope.state));
      const projection = envelope.access;
      if (!projection.account || projection.account.status !== "active") {
        return failedContext("invalid_response");
      }

      const generatedAt = Date.parse(projection.generated_at);
      const stale = !Number.isFinite(generatedAt) || Date.now() - generatedAt > this.staleAfterMs;
      const businesses = projection.businesses.map((business) => ({
        business: {
          id: business.id,
          organizationId: business.organization_id,
          name: business.display_name,
          status: business.status,
          synthetic: false,
        },
        membership: {
          id:
            projection.memberships.find((membership) => membership.business_id === business.id)?.id ??
            `missing-${business.id}`,
          accountId: projection.account!.id,
          businessId: business.id,
          status: "active" as const,
        },
        entitlements: projection.entitlements
          .filter((entitlement) => entitlement.business_id === business.id)
          .map((entitlement) => ({
            id: entitlement.id ?? `missing-${business.id}-${entitlement.product}`,
            businessId: business.id,
            product: entitlement.product,
            status: entitlement.status,
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
        selectedBusinessId: envelope.context.canonicalBusinessId,
        source: "core",
        health: stale ? "stale" : "live",
        failure: "none",
        generatedAt: projection.generated_at,
      };
    } catch {
      return failedContext("adapter_error");
    }
  }
}

// Activation remains explicit. The adapter calls only the same-origin BFF;
// it never accepts an Account/source tuple and never carries a Core credential.
export const coreAccessContextAdapter = new CoreAccessContextAdapter({ enabled: false });
