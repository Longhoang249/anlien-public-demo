# ANLIEN Project State

Last updated: 2026-08-28
State owner: ChatGPT planning/review
Execution owner: Codex

## Overall status

ACTIVE — integration architecture is defined; first production-shaped projection boundary is under implementation.

## Current milestone

M2 — First real product projection boundary

## Current reality

- `main` baseline: Owner Command Center V3.
- The Shell still runs on deterministic demo fixtures; it has no production API, database, authentication, SSO, or cross-product write path.
- Architecture boundary is already defined as UI → typed contracts → product adapter boundary → product-owned versioned projections.
- Reality/contract audit and V1 read-projection proposal exist.
- Ops is the most ready source domain for the first P0 projection.
- PR #2 (`feat/owner-projection-v1`) is open and adds the first Ops owner projection V1 contract/provider boundary. It deliberately does not connect production Supabase, mutate Ops schema, or change UI V3.

## Locked constraints for current work

- Do not merge the three product databases/codebases.
- Do not query Ops internal tables directly from the Shell.
- Do not add write-back in the current read-projection milestone.
- Do not invent canonical Business/Location IDs.
- Do not claim live integration while only mocks/contracts exist.
- Preserve demo fallback only as an explicit demo mode, never as silent fallback from failed live data.

## CURRENT_SLICE

### Slice M2-S1 — Review and land the Ops projection contract boundary

Objective:
Validate that PR #2 is a truthful, minimal and reusable first read-projection boundary before any runtime producer or production connectivity is attempted.

Required work:
1. Review PR #2 against the architecture invariants in `AGENTS.md` and the approved proposal/audit documents.
2. Verify the contract separates product-local IDs from optional canonical references.
3. Verify the provider boundary can support both current mock data and a future authorized live producer without Shell table coupling.
4. Verify attendance/task/review semantics do not overclaim unsupported business meaning.
5. Run or inspect relevant type/build/tests available in the branch.
6. Record review evidence and any blocking findings.
7. Only after the slice passes review should PR #2 be considered ready to merge.

Acceptance criteria:
- No direct product-table dependency is introduced in Shell code.
- No production mutation path is introduced.
- No guessed canonical mapping is required.
- Contract health/freshness/failure semantics are explicit enough for future live adapters.
- Existing V3 UI can remain on deterministic demo mode without pretending to be live.
- Build/type verification passes, or any failure is documented as a blocker.
- Review outcome is recorded in `.planning/EVIDENCE.md`.

## Not in current slice

- Do not implement Identity Bridge.
- Do not connect Ops Supabase production.
- Do not implement Marketing/Loyalty live projections.
- Do not add auth/SSO.
- Do not redesign V3 UI.
- Do not implement write commands.

## Next decision gate

After M2-S1 evidence is reviewed:

- PASS → merge/land the contract boundary, then plan the smallest runtime producer/read path as M2-S2.
- BLOCKED → fix only contract-boundary defects, re-verify, then return to the same gate.
- ARCHITECTURE CONFLICT → stop implementation and re-plan before further coding.

## Known blockers beyond current slice

- No VERIFIED runtime Identity Bridge mapping for the pilot Business/Locations.
- No approved production read projection currently published by all three products.
- Shell has no production authentication/authorization context yet.
