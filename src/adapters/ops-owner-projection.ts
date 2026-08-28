import type {
  OpsOwnerProjectionProvider,
  OpsOwnerProjectionV1,
} from "@/src/contracts/owner-projections";
import {
  demoLocations,
  ownerDashboardDemo,
} from "@/src/data/demo/fixtures";

function numericValue(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function ratioValue(value: string): { current: number; total: number } {
  const [current, total] = value.split("/").map((part) => Number(part.trim()));
  return {
    current: Number.isFinite(current) ? current : 0,
    total: Number.isFinite(total) ? total : 0,
  };
}

/**
 * Demo provider implements the same boundary that a future authenticated Ops provider will use.
 * It deliberately does not know any Ops database schema.
 */
export class MockOpsOwnerProjectionProvider implements OpsOwnerProjectionProvider {
  async getOwnerProjection(): Promise<OpsOwnerProjectionV1> {
    const attendance = ratioValue(ownerDashboardDemo.metrics.staffCheckIn.value);
    const tasks = ratioValue(ownerDashboardDemo.metrics.taskCompletion.value);
    const overdue = numericValue(ownerDashboardDemo.metrics.opsOverdue.value);
    const pendingReview = numericValue(ownerDashboardDemo.metrics.opsPendingReview.value);

    return {
      contract: "ops_owner_projection.v1",
      owner: "ops",
      generatedAt: "2026-08-28T11:32:00+07:00",
      projectionDate: "2026-08-28",
      freshness: {
        status: "live",
        asOf: "2026-08-28T11:32:00+07:00",
      },
      source: {
        organizationId: "demo-ops-organization",
      },
      canonical: {
        organizationId: "demo-org-fnb-an-lien",
        businessId: "demo-business-fnb-an-lien",
      },
      health: overdue > 0 || pendingReview > 0 ? "attention" : "healthy",
      totals: {
        staffScheduledToday: attendance.total,
        staffCheckedInToday: attendance.current,
        staffLateToday: 0,
        tasksTotalToday: tasks.total,
        tasksCompletedToday: tasks.current,
        tasksOverdue: overdue,
        tasksPendingReview: pendingReview,
      },
      locations: demoLocations.map((location, index) => ({
        sourceLocationId: `demo-ops-location-${index + 1}`,
        anlienLocationId: location.id,
        name: location.name,
        attendance: {
          scheduledToday: index === 0 ? attendance.total : 0,
          checkedInToday: index === 0 ? attendance.current : 0,
          lateToday: 0,
        },
        tasks: {
          totalToday: index === 0 ? tasks.total : 0,
          completedToday: index === 0 ? tasks.current : 0,
          overdue: index === 0 ? overdue : 0,
          pendingReview: index === 0 ? pendingReview : 0,
        },
      })),
      actions: ownerDashboardDemo.priorities
        .filter((priority) => priority.owner === "ops")
        .map((priority) => ({
          id: priority.id,
          source: "ops" as const,
          type: priority.futureSource,
          title: priority.title,
          description: priority.detail,
          priority: priority.tone === "warning" ? ("today" as const) : ("normal" as const),
          status: "pending" as const,
          scope: priority.scope,
          primaryAction: {
            label: priority.actionLabel,
            href: "/demo/ops",
          },
        })),
    };
  }
}
