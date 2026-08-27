import type { AccessContext } from "@/src/contracts/shell";

const account = {
  id: "preview-account",
  label: "ANLIEN Account",
  status: "active" as const,
  synthetic: true,
};

const primary = {
  business: {
    id: "preview-business-mua",
    organizationId: "preview-org",
    name: "MUA cafe",
    status: "active" as const,
    synthetic: true,
  },
  membership: {
    id: "preview-membership-mua",
    accountId: account.id,
    businessId: "preview-business-mua",
    status: "active" as const,
  },
  entitlements: (["marketing", "loyalty", "ops"] as const).map((product) => ({
    id: `preview-entitlement-${product}`,
    businessId: "preview-business-mua",
    product,
    status: "active" as const,
  })),
};

const second = {
  business: {
    id: "preview-business-studio",
    organizationId: "preview-org",
    name: "Bếp thử nghiệm",
    status: "active" as const,
    synthetic: true,
  },
  membership: {
    id: "preview-membership-studio",
    accountId: account.id,
    businessId: "preview-business-studio",
    status: "active" as const,
  },
  entitlements: (["marketing", "loyalty", "ops"] as const).map((product) => ({
    id: `preview-studio-${product}`,
    businessId: "preview-business-studio",
    product,
    status: product === "loyalty" ? ("active" as const) : ("inactive" as const),
  })),
};

const ready = (businesses: AccessContext["businesses"]): AccessContext => ({
  mode: "PRIVATE_WORKSPACE",
  account,
  businesses,
  selectedBusinessId: businesses[0]?.business.id ?? null,
  source: "synthetic",
  health: "live",
  failure: "none",
  generatedAt: "2026-08-27T00:00:00.000Z",
});

export const privateAccessScenarios = {
  one_business: ready([primary]),
  multi_business: ready([primary, second]),
  inactive_membership: {
    ...ready([{ ...primary, membership: { ...primary.membership, status: "inactive" as const } }]),
    failure: "not_member" as const,
  },
  no_entitlements: {
    ...ready([
      {
        ...primary,
        entitlements: primary.entitlements.map((item) => ({ ...item, status: "inactive" as const })),
      },
    ]),
    failure: "not_entitled" as const,
  },
  not_authenticated: {
    ...ready([]),
    account: null,
    failure: "not_authenticated" as const,
  },
  core_unavailable: {
    ...ready([]),
    account: null,
    health: "unavailable" as const,
    failure: "core_unavailable" as const,
  },
  adapter_error: {
    ...ready([]),
    account: null,
    health: "error" as const,
    failure: "adapter_error" as const,
  },
} satisfies Record<string, AccessContext>;

export type PrivateAccessScenario = keyof typeof privateAccessScenarios;
