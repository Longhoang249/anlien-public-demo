import type {
  LoyaltyDemo,
  MarketingDemo,
  OpsDemo,
  ProductSummary,
} from "@/src/contracts/shell";
import {
  loyaltyDemo,
  loyaltySummary,
  marketingDemo,
  marketingSummary,
  opsDemo,
  opsSummary,
} from "@/src/data/demo/fixtures";

export interface MarketingSummaryAdapter {
  getSummary(): ProductSummary;
  getDemo(): MarketingDemo;
}

export interface LoyaltySummaryAdapter {
  getSummary(): ProductSummary;
  getDemo(): LoyaltyDemo;
}

export interface OpsSummaryAdapter {
  getSummary(): ProductSummary;
  getDemo(): OpsDemo;
}

export class MockMarketingAdapter implements MarketingSummaryAdapter {
  getSummary() {
    return marketingSummary;
  }

  getDemo() {
    return marketingDemo;
  }
}

export class MockLoyaltyAdapter implements LoyaltySummaryAdapter {
  getSummary() {
    return loyaltySummary;
  }

  getDemo() {
    return loyaltyDemo;
  }
}

export class MockOpsAdapter implements OpsSummaryAdapter {
  getSummary() {
    return opsSummary;
  }

  getDemo() {
    return opsDemo;
  }
}

// Future adapters must consume versioned, read-only projections. They must not
// query another product database directly.

