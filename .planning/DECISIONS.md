# ANLIEN Decision Log

Only durable, approved decisions belong here. New implementation discoveries do not become locked decisions automatically.

## D-001 — Shell is an integration portal, not a product rewrite
Status: LOCKED
Decision: Keep Marketing, Loyalty, and Ops independently operable. The Shell integrates their owner-facing information through explicit contracts/adapters.
Reason: Preserves domain ownership, limits migration risk, and avoids cross-product coupling.

## D-002 — Product-owned versioned read projections
Status: LOCKED
Decision: Shell consumes typed/versioned projections published or owned by each product domain. It must not read another product's internal tables directly.
Reason: Prevents schema leakage and lets source products evolve independently.

## D-003 — Read and write contracts are separate
Status: LOCKED
Decision: The first integration path is read-only. Future mutations require separate command contracts with authorization, idempotency, auditability, and failure handling.
Reason: Owner actions are materially higher-risk than read aggregation.

## D-004 — Canonical identity requires VERIFIED mapping
Status: LOCKED
Decision: Similar product-local IDs or names never imply canonical identity. Canonical Business/Location references may be emitted only after an explicit mapping is VERIFIED.
Reason: Avoids cross-tenant/data-association errors.

## D-005 — Identity is not entitlement
Status: LOCKED
Decision: Resolving that two records refer to the same Business/Location does not grant the caller access to either source product.
Reason: Authentication/authorization remain product and membership concerns.

## D-006 — Explicit data health; no silent demo fallback
Status: LOCKED
Decision: Live integrations must expose freshness/failure states explicitly. A failed live source must not silently show fixture/demo values as if they were live.
Reason: The Owner Portal must be operationally truthful.

## D-007 — Rolling-wave execution
Status: LOCKED
Decision: Maintain a milestone roadmap but decompose only the current executable slice. Codex executes `CURRENT_SLICE` only unless explicitly overridden.
Reason: Reduces speculative planning and scope drift.

## D-008 — Shared planning state governs both ChatGPT and Codex
Status: LOCKED
Decision: `.planning/` is the shared execution state. ChatGPT owns strategy/planning/review; Codex owns implementation/verification. A Codex planner plugin may assist decomposition but does not override `.planning/` or product decisions.
Reason: Keeps strategic authority separate from execution automation.

## D-009 — Ops is the first projection candidate
Status: CURRENT DIRECTION
Decision: Validate Ops P0 projection first because attendance, overdue work, and review queue/SLA have the strongest current source semantics/readiness.
Reason: It is the lowest-risk route to proving the projection boundary.
Reopen if: audit evidence changes or the Ops source cannot provide an authorized producer path.
