import type { AccessContext } from "@/src/contracts/shell";

const demoAccountId = "demo-account-owner";
const demoBusinessId = "demo-business-fnb-an-lien";
const studioBusinessId = "demo-business-studio";

export const demoAccessContext: AccessContext = {
  mode: "PUBLIC_DEMO",
  account: {
    id: demoAccountId,
    label: "Demo Owner",
    status: "active",
    synthetic: true,
  },
  selectedBusinessId: demoBusinessId,
  source: "synthetic",
  businesses: [
    {
      business: {
        id: demoBusinessId,
        organizationId: "demo-org-fnb-an-lien",
        name: "FnB Ăn Liền (Demo quán)",
        status: "active",
        synthetic: true,
      },
      membership: {
        id: "demo-membership-owner-primary",
        accountId: demoAccountId,
        businessId: demoBusinessId,
        status: "active",
      },
      entitlements: (["marketing", "loyalty", "ops"] as const).map((product) => ({
        id: `demo-entitlement-${product}`,
        businessId: demoBusinessId,
        product,
        status: "active" as const,
      })),
    },
    {
      business: {
        id: studioBusinessId,
        organizationId: "demo-org-fnb-an-lien",
        name: "Bếp thử nghiệm (Demo)",
        status: "active",
        synthetic: true,
      },
      membership: {
        id: "demo-membership-owner-studio",
        accountId: demoAccountId,
        businessId: studioBusinessId,
        status: "active",
      },
      entitlements: [
        {
          id: "demo-entitlement-studio-loyalty",
          businessId: studioBusinessId,
          product: "loyalty",
          status: "active",
        },
        {
          id: "demo-entitlement-studio-ops",
          businessId: studioBusinessId,
          product: "ops",
          status: "active",
        },
        {
          id: "demo-entitlement-studio-marketing",
          businessId: studioBusinessId,
          product: "marketing",
          status: "inactive",
        },
      ],
    },
  ],
};
