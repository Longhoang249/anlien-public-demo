# ANLIEN Agent Operating Rules

This repository is the integration shell/control plane for the ANLIEN multi-product project.

## Roles

- Product Owner (Long): final business/product decisions.
- ChatGPT: strategy, architecture, planning, review, and milestone approval.
- Codex: implementation executor and technical verifier.
- `.planning/`: shared project state and the source of truth for execution sequencing.

## Required startup read

Before any substantial implementation, migration, integration, or architectural task, read these files in order:

1. `.planning/PROJECT.md`
2. `.planning/STATE.md`
3. `.planning/DECISIONS.md`
4. `.planning/EVIDENCE.md`

For tiny isolated fixes, still obey all locked decisions in `.planning/DECISIONS.md`.

## Execution boundary

1. Execute only the `CURRENT_SLICE` declared in `.planning/STATE.md` unless the user explicitly overrides it.
2. Do not open or implement a later milestone merely because it appears technically obvious.
3. Do not change a LOCKED decision without explicit Product Owner or ChatGPT planning approval.
4. Do not broaden scope while implementing. Surface new work as a proposed follow-up instead.
5. Every completed slice must leave observable verification evidence: tests, build output, commit/PR, deployment check, or a documented reason verification could not run.
6. Update `.planning/EVIDENCE.md` when implementation produces durable evidence. Do not rewrite history or mark unverified work as complete.
7. If implementation reality conflicts with `.planning/STATE.md` or `.planning/DECISIONS.md`, stop the conflicting implementation and report the discrepancy for re-planning.

## Architecture invariants

- Marketing, Loyalty, and Ops remain independently operable products.
- The Shell consumes typed, versioned product-owned projections/contracts; it must not query another product's internal tables directly.
- No cross-product shared database coupling.
- No write-back through a read projection. Mutations require a separately designed command contract with authorization, idempotency, auditability, and failure handling.
- Product-local IDs remain product-local. Canonical ANLIEN references may be emitted only from VERIFIED mappings.
- Identity mapping does not grant product entitlement.
- Missing/stale/error states must be explicit; never silently replace failed live data with demo fixtures.

## Planner usage

When the `planner@codex-planner` plugin is installed, use it as a decomposition/quality-check aid, not as an authority over product strategy. The shared `.planning/` files remain authoritative.

Prefer rolling-wave planning: keep the roadmap at milestone level and decompose only the current executable slice. Do not create artificial 5/10/15-minute tasks when a coherent implementation unit is clearer; optimize for bounded scope, explicit acceptance criteria, dependencies, and evidence.
