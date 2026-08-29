import type { DataHealthStatus, DataScope, ProductKey } from "@/src/contracts/shell";

export type OwnerActionPriority = "critical" | "today" | "normal";
export type OwnerActionStatus = "pending" | "resolved" | "dismissed";

/** Stable cross-product action primitive. Ops owns truth and lifecycle. */
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
  assignee?: { id: string; name: string };
  createdAt?: string;
  dueAt?: string;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
}

export interface ProjectionFreshness {
  status: Extract<DataHealthStatus, "live" | "stale" | "unavailable" | "error">;
  asOf: string;
}

export interface OpsLocationProjectionV1 {
  /** Ops shops.id. Location semantic only; never canonical authority. */
  sourceLocationId: string;
  anlienLocationId?: string;
  name: string;
  attendance: {
    scheduledToday: number;
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

/** Exact read-only producer contract from ANLIEN Ops PR #2. */
export interface OpsOwnerProjectionV1 {
  contract: "ops_owner_projection.v1";
  owner: "ops";
  generatedAt: string;
  projectionDate: string;
  freshness: ProjectionFreshness;
  source: { organizationId: string };
  canonical?: { organizationId?: string; businessId?: string };
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

export type OwnerOpsProjectionDataState = "LIVE" | "STALE" | "UNAVAILABLE" | "ERROR";

export type OwnerOpsProjectionResultV1 =
  | {
      contract: "owner_ops_projection_result.v1";
      state: "LIVE" | "STALE";
      projection: OpsOwnerProjectionV1;
      reason: null;
    }
  | {
      contract: "owner_ops_projection_result.v1";
      state: "UNAVAILABLE" | "ERROR";
      projection: null;
      reason:
        | "LIVE_PROVIDER_DISABLED"
        | "MAPPING_UNAVAILABLE"
        | "MAPPING_INCONSISTENT"
        | "GATEWAY_UNAVAILABLE"
        | "GATEWAY_AUTHORIZATION_FAILED"
        | "CONTRACT_MISMATCH";
    };

export interface OpsOwnerProjectionProvider {
  getOwnerProjection(): Promise<OpsOwnerProjectionV1>;
}
