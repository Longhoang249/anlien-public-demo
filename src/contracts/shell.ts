export type ProductKey = "marketing" | "loyalty" | "ops";
export type ShellMode = "demo" | "authenticated";
export type DataScope = "business" | "location";
export type DataHealthStatus = "demo" | "live" | "stale" | "unavailable" | "error";
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
  status: DataHealthStatus;
}

export interface ProductAlert {
  id: string;
  product: ProductKey;
  tone: "warning" | "neutral" | "success";
  label: string;
  detail?: string;
  scope: DataScope;
  status: DataHealthStatus;
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
    readiness: number;
    status: string;
    voice: string[];
    audience: string;
    visualStyle: string[];
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

export interface OwnerAssignment {
  id: string;
  task: string;
  assignee: string;
  due: string;
  status: "doing" | "review" | "late";
}

export type OwnerActionKey = "assign" | "customers" | "idea" | "brand";

export interface OwnerPriority {
  id: string;
  owner: ProductKey;
  scope: DataScope;
  status: DataHealthStatus;
  futureSource: string;
  tone: "warning" | "neutral" | "success";
  area: string;
  title: string;
  detail?: string;
  action: OwnerActionKey;
  actionLabel: string;
}

export interface OwnerQuickAction {
  id: string;
  label: string;
  detail: string;
  action: OwnerActionKey;
}

export interface OwnerProductPreview {
  product: ProductKey;
  eyebrow: string;
  title: string;
  promise: string;
  features: string[];
  facts: string[];
  href: string;
  actionLabel: string;
}

export interface OwnerDashboardDemo {
  metrics: {
    staffCheckIn: SummaryMetric;
    taskCompletion: SummaryMetric;
    loyaltySignalsToday: SummaryMetric;
    newToday: SummaryMetric;
    brandReadiness: SummaryMetric;
    opsOverdue: SummaryMetric;
    opsPendingReview: SummaryMetric;
    customerProfiles: SummaryMetric;
    inactiveCustomers: SummaryMetric;
    vouchersToday: SummaryMetric;
    gamePlaysToday: SummaryMetric;
    ideasToday: SummaryMetric;
    touchpointsPending: SummaryMetric;
  };
  branches: Array<{
    locationId: string;
    completion: SummaryMetric;
    status: string;
  }>;
  assignments: OwnerAssignment[];
  priorities: OwnerPriority[];
  quickActions: OwnerQuickAction[];
  productPreviews: OwnerProductPreview[];
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
  owner: OwnerDashboardDemo;
  timeline: DayMoment[];
}
