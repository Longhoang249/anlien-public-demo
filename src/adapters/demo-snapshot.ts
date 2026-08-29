import type { DemoSnapshot } from "@/src/contracts/shell";
import {
  demoBusiness,
  demoLocations,
  demoOrganization,
  dayTimeline,
  ownerDashboardDemo,
} from "@/src/data/demo/fixtures";
import {
  MockLoyaltyAdapter,
  MockMarketingAdapter,
  MockOpsAdapter,
} from "@/src/adapters/product-adapters";
import { DemoAccessContextAdapter } from "@/src/adapters/access-context-adapter";

const marketing = new MockMarketingAdapter();
const loyalty = new MockLoyaltyAdapter();
const ops = new MockOpsAdapter();
const access = new DemoAccessContextAdapter();

export function getDemoSnapshot(): DemoSnapshot {
  return {
    mode: "demo",
    generatedAtLabel: "Cập nhật lúc 18:32 · Hôm nay",
    organization: demoOrganization,
    business: demoBusiness,
    accessContext: access.getAccessContext(),
    locations: demoLocations,
    summaries: {
      marketing: marketing.getSummary(),
      loyalty: loyalty.getSummary(),
      ops: ops.getSummary(),
    },
    marketing: marketing.getDemo(),
    loyalty: loyalty.getDemo(),
    ops: ops.getDemo(),
    owner: ownerDashboardDemo,
    timeline: dayTimeline,
  };
}
