# ANLIEN Unified Owner Portal — Project Charter

Status: ACTIVE
Planning mode: rolling wave
Primary integration repo: `Longhoang249/anlien-public-demo`

## North Star

Give an F&B owner one truthful command center to understand what is happening across Marketing, Loyalty, and Operations, decide what needs attention, and drill into the owning product when necessary.

## Product boundary

The Owner Portal is an integration shell, not a rewrite of the three source products.

Source products:
- Marketing: `dong-goi-thuong-hieu`
- Loyalty: `fnbanlien-play`
- Ops: `fnbanlien-tu-van-hanh`

Each source product remains independently operable and owns its domain semantics and calculations.

## Locked scope

IN:
- shared owner-facing shell/navigation/context
- typed contracts and adapters
- product-owned, versioned read projections
- verified Identity/Business/Location mapping
- explicit data health/freshness states
- gradual replacement of deterministic demo adapters with authorized live read adapters
- owner-oriented cross-domain summaries and attention signals

OUT unless separately approved:
- big-bang merger of the three codebases
- direct Shell queries into product internal tables
- shared cross-product database coupling
- production mutations/write-back through read contracts
- guessed canonical IDs
- silent live-to-demo fallback
- autonomous business decisions or campaign execution

## Architecture target

```text
ANLIEN Owner Portal
↓
Shared Identity + Business/Location Context
↓
Typed/versioned product adapter boundary
├── Marketing read projection
├── Loyalty read projection
└── Ops read projection
↓
Product-owned source truth
```

## Final Definition of Done

The first unified production-capable portal milestone is DONE only when:

1. A verified pilot Business can be resolved across the relevant source products without guessing IDs.
2. Shell authentication/authorization establishes the caller and permitted Business/Location context.
3. At least the approved P0 read projection from each in-scope source product can be consumed through a versioned contract.
4. Shell renders real data with explicit `live/stale/partial/unavailable/unauthorized/error/not_configured` behavior.
5. A failed source cannot make another product's data misleading or unavailable.
6. No production read path bypasses the product-owned projection boundary.
7. Demo data is visibly demo and never silently substitutes for failed live data.
8. Build, contract tests, and integration verification pass for the pilot scope.
9. Product Owner has reviewed the owner workflow and accepts that the portal answers: “quán đang thế nào?” and “việc nào cần xử lý?” without requiring users to understand the underlying software architecture.

## Milestones

### M0 — Reality and contract baseline — DONE
Audit the current shell and the three source systems; distinguish verified reality from demo assumptions; propose minimal read contracts.

### M1 — Owner shell baseline V3 — DONE
Adopt the owner-first command center as the presentation baseline while retaining deterministic demo adapters.

### M2 — First real product projection boundary — IN PROGRESS
Create the first production-shaped read-only contract/provider path, beginning with Ops, without connecting the Shell directly to product tables or production mutations.

### M3 — Verified identity/context bridge — PLANNED
Resolve Business/Location/product-local identities for a pilot business through an explicit VERIFIED mapping process; separate identity from entitlement.

### M4 — Live read integration — PLANNED
Replace product mock adapters incrementally with authorized live projection adapters, beginning with the projection(s) that have passed contract review.

### M5 — Pilot hardening and owner acceptance — PLANNED
Auth, permissions, degradation behavior, observability, owner UX validation, rollout and cutover criteria.

## Planning protocol

- Strategy/architecture/business decisions are approved by Product Owner + ChatGPT.
- Codex executes bounded implementation slices.
- Only the current milestone is decomposed in detail.
- New discoveries become evidence or proposed work; they do not automatically expand the current slice.
- Durable decisions go in `DECISIONS.md`.
- Current progress and next executable unit go in `STATE.md`.
- Verifiable outputs go in `EVIDENCE.md`.
