# ops_owner_projection.v1

**Status:** Draft implementation contract  
**Owning product/domain:** Ops (`fnbanlien-tu-van-hanh`)  
**Consumer:** ANLIEN Owner Command Center (`anlien-public-demo`)  
**Contract type:** Read Projection  
**Version:** v1

## Business job

Give a cafe owner one read-only operational pulse without coupling ANLIEN to Ops internal tables.

The projection answers only:

- how many distinct staff are scheduled today;
- how many distinct staff have an observed attendance check-in today;
- how many tasks exist/completed today;
- how many tasks are overdue;
- how many tasks are waiting for owner/manager review;
- which operational exceptions currently deserve owner attention.

It does not expose raw evidence, selfies, staff private details, full SOP rows, or generic database records.

## Ownership and source of truth

Ops owns the projection and all source truth.

ANLIEN MUST NOT recreate the projection by directly querying Ops internal tables. Internal source tables currently include `shift_assignments`, `attendance_checkins`, `task_instances`, `shops`, memberships and related operational records, but those shapes are implementation details of Ops rather than the consumer contract.

## Tenant and identity scope

Current Ops physical semantics:

- `Ops organizations.id` is an Ops source organization identifier.
- `Ops shops.id` represents a physical Location.
- neither identifier may be assumed equal to Marketing, Loyalty, or canonical ANLIEN ids.

The projection therefore exposes source identifiers separately from optional canonical mappings.

```text
source.organizationId     = physical Ops organization id
locations[].sourceLocationId = physical Ops shops.id
canonical.*               = present only after explicit Identity Bridge mapping
locations[].anlienLocationId = present only after explicit mapping
```

## Authorization

The future live producer must authorize server-side using the authenticated account plus active Ops membership/entitlement and requested organization/location scope.

Frontend visibility is not authorization. The shell must never receive or use a Supabase `service_role` key.

## Freshness

`projectionDate` defines the operational date whose daily metrics are summarized.

`generatedAt` / `freshness.asOf` define when the projection was generated.

Consumers must support `live`, `stale`, `unavailable`, and `error` states and degrade to the existing demo/empty experience rather than breaking the Owner Command Center.

## Metric semantics

### Attendance

`staffScheduledToday`
: Count of **distinct employees** assigned to at least one shift slot for `projectionDate`. Do not count shift-assignment rows directly because one employee may own multiple area slots.

`staffCheckedInToday`
: Count of **distinct employees/users** with an observed attendance record for `projectionDate` in projection scope.

`staffLateToday`
: Count of observed attendance records classified late by Ops-owned attendance semantics.

This v1 contract intentionally describes the whole projection date. It does **not** claim that attendance values describe the currently active shift.

### Tasks

`tasksTotalToday`
: Count of operational tasks for `projectionDate` in scope.

`tasksCompletedToday`
: Count of tasks whose Ops-owned normalized state is completed/approved.

`tasksOverdue`
: Count of unresolved tasks currently past their Ops-defined due time.

`tasksPendingReview`
: Count of tasks currently awaiting human review according to Ops-owned normalized state. ANLIEN must not infer this from a raw database enum such as `submitted`.

## Actions

`actions[]` contains owner-facing exceptions/recommendations only. Supported v1 operational families include:

- missing/suspicious attendance signals;
- overdue tasks;
- pending review beyond the configured review SLA.

Actions are read-only signals. Consequential operations follow:

```text
Signal → Recommendation → Human Confirmation → Ops-owned action
```

The projection itself never approves a task, changes a shift, or edits employee state.

## Empty and failure semantics

- Valid scope with no activity: return zero counts and an empty `actions` array.
- Scope not mapped to canonical ANLIEN ids: source identifiers remain valid; canonical fields are omitted.
- Source temporarily unavailable: return/translate to `freshness.status = unavailable` where possible; consumer keeps rendering other domains.
- Contract parsing/version mismatch: consumer treats Ops projection as unavailable rather than reading raw Ops data as fallback.

## Compatibility policy

Additive optional fields are allowed within v1 when semantics do not change.

Breaking changes to field meaning, required fields, scope, or authorization require a new explicit contract version (`ops_owner_projection.v2`) or a documented cutover.

## Data minimization

v1 deliberately does not expose:

- attendance selfie URLs;
- GPS coordinates;
- employee email/phone;
- task evidence;
- raw memberships;
- raw SOP definitions;
- unrestricted activity logs.

If Owner Command Center needs one of these later, it must be justified as a separate minimal contract or explicit deep-link flow owned by Ops.
