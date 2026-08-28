import type { DataHealthStatus, DataScope, ProductKey } from "@/src/contracts/shell";

export type OwnerActionPriority = "critical" | "today" | "normal";
export type OwnerActionStatus = "pending" | "resolved" | "dismissed";

/**
 * Stable cross-product action primitive consumed by Owner Command Center.
 * The source domain owns truth and lifecycle; the shell only renders it.
 */
export interface OwnerActionProjection {
  id: string;
  source: ProductKey;
  type: string;
  title: string;
  description?: string;
  priority: OwnerActionPriority;
  status: OwnerActionStatus;
  scope: DataScope;
  sourceEntityId?: string;
  assignee?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  dueAt?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
}

export interface ProjectionFreshness {
  status: Extract<DataHealthStatus, "live" | "stale" | "unavailable" | "error">;
  asOf: string;
}

export interface OpsLocationProjectionV1 {
  /** Ops-owned physical shops.id. This is a Location semantic, not a cross-product shop id. */
  sourceLocationId: string;
  /** Canonical ANLIEN Location id, only when an explicit mapping exists. */
  anlienLocationId?: string;
  name: string;
  attendance: {
    /** Distinct employees scheduled for the projection date. */
    scheduledToday: number;
    /** Distinct employees with an observed attendance check-in for the projection date. */
    checkedInToday: number;
    lateToday: number;
  };
  tasks: {
    totalToday: number;
    completedToday: number;
    overdue: number;
    pendingReview: number;
  };
}

/**
 * Read-only projection owned by Ops and consumed by ANLIEN Owner Command Center.
 *
 * Contract rule: shell code must not infer this payload by reading Ops internal tables directly.
 */
export interface OpsOwnerProjectionV1 {
  contract: "ops_owner_projection.v1";
  owner: "ops";
  generatedAt: string;
  projectionDate: string;
  freshness: ProjectionFreshness;
  source: {
    /** Physical Ops organizations.id. Never assume equality with canonical Organization/Business ids. */
    organizationId: string;
  };
  canonical?: {
    organizationId?: string;
    businessId?: string;
  };
  health: "healthy" | "attention" | "unavailable";
  totals: {
    staffScheduledToday: number;
    staffCheckedInToday: number;
    staffLateToday: number;
    tasksTotalToday: number;
    tasksCompletedToday: number;
    tasksOverdue: number;
    tasksPendingReview: number;
  };
  locations: OpsLocationProjectionV1[];
  actions: OwnerActionProjection[];
}

export interface OpsOwnerProjectionProvider {
  getOwnerProjection(): Promise<OpsOwnerProjectionV1>;
}
