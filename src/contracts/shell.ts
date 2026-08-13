export type ProductKey = "marketing" | "loyalty" | "ops";
export type ShellMode = "demo" | "authenticated";
export type DataScope = "business" | "location";
export type IntegrationStatus = "demo" | "not-connected";
export type ProductStatus = "healthy" | "attention" | "inactive";
export type RoleKey = "owner" | "manager" | "marketing" | "staff";

export interface OrganizationContext {
  id: string;
  name: string;
}

export interface BusinessContext {
  id: string;
  organizationId: string;
  name: string;
  isDemo: boolean;
  status: "active" | "inactive";
}

export interface LocationContext {
  id: string;
  businessId: string;
  name: string;
}

export interface SummaryMetric {
  id: string;
  label: string;
  value: string;
  detail?: string;
  owner: ProductKey;
  futureSource: string;
  scope: DataScope;
  status: IntegrationStatus;
}

export interface ProductAlert {
  id: string;
  product: ProductKey;
  tone: "warning" | "neutral" | "success";
  label: string;
  detail?: string;
  scope: DataScope;
  status: IntegrationStatus;
}

export interface ProductSummary {
  product: ProductKey;
  status: ProductStatus;
  promise: string;
  metrics: SummaryMetric[];
  alerts: ProductAlert[];
}

export interface MarketingDemo {
  suggestion: string;
  reasons: string[];
  brandDna: {
    status: string;
    voice: string[];
    audience: string;
    promise: string;
    touchpointsPending: number;
  };
  ideas: Array<{
    id: string;
    title: string;
    angle: string;
    channel: string;
  }>;
  touchpoints: Array<{
    label: string;
    status: "ready" | "pending";
  }>;
  advisors: Array<{
    label: string;
    description: string;
  }>;
}

export interface CustomerGroup {
  id: string;
  label: string;
  count: number;
  note: string;
  highlighted?: boolean;
}

export interface LoyaltyDemo {
  recommendation: string;
  offer: {
    name: string;
    value: string;
    validity: string;
  };
  groups: CustomerGroup[];
}

export interface ShiftMember {
  id: string;
  name: string;
  status: "checked-in" | "missing";
  detail: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  complete: boolean;
}

export interface OpsDemo {
  shift: {
    name: string;
    time: string;
    location: string;
    members: ShiftMember[];
  };
  checklist: {
    name: string;
    completed: number;
    total: number;
    items: ChecklistItem[];
  };
}

export interface DayMoment {
  time: string;
  label: string;
  product: ProductKey | "overview";
  message: string;
  action: string;
}

export interface DemoSnapshot {
  mode: ShellMode;
  generatedAtLabel: string;
  organization: OrganizationContext;
  business: BusinessContext;
  locations: LocationContext[];
  summaries: Record<ProductKey, ProductSummary>;
  marketing: MarketingDemo;
  loyalty: LoyaltyDemo;
  ops: OpsDemo;
  timeline: DayMoment[];
}
