# ANLIEN Evidence Ledger

Record only observable evidence. Do not mark work complete based on intent or unverified claims.

## Baseline evidence

### E-001 — Owner Command Center V3 baseline
Date: 2026-08-28
Evidence:
- `main` commit `1129baa28c96251bb0bde3a4be7b8f397cb78b26`
- Commit message: `Refactor owner command center V3`
Interpretation:
- V3 is the current presentation baseline for the integration shell.

### E-002 — Current integration readiness
Source:
- `docs/ANLIEN_SHELL_INTEGRATION_READINESS.md`
Observed state:
- deterministic mock fixtures only
- no production API/database/auth/SSO/cross-product write
- Shell boundary is UI → typed contracts → product adapter boundary → future versioned read projections
- no VERIFIED runtime Identity Bridge mapping
Interpretation:
- Shell is ready for UI/contract review, not live production connectivity.

### E-003 — Read Projection V1 proposal
Source:
- `docs/ANLIEN_READ_PROJECTION_V1_PROPOSAL.md`
Observed state:
- implementation authorization was not granted by the proposal itself
- Marketing readiness: PARTIAL
- Loyalty readiness: PARTIAL
- Ops minimal P0 readiness: strongest for attendance, overdue work, review queue/SLA
Interpretation:
- Ops is the preferred first boundary proof, but runtime integration still requires a separately authorized implementation slice.

### E-004 — Ops projection PR opened
Date: 2026-08-28
PR: #2 `Add Ops owner projection V1 contract`
Branch: `feat/owner-projection-v1`
Head at planning bootstrap: `616de425403539991c4d6369798566e6c08c55bb`
Observed PR scope:
- adds `ops_owner_projection.v1` contract
- separates Ops source IDs from canonical ANLIEN IDs
- adds generic owner action projection
- adds mock provider using the same contract
Explicitly excluded:
- direct Ops table reads from Shell
- write-back
- Ops schema changes
- production Supabase connection
- UI V3 changes
Interpretation:
- Candidate implementation for milestone M2-S1; review/verification still required before marking the slice PASS.

## Planner bootstrap evidence

### E-005 — Shared planning governance branch
Date: 2026-08-28
Branch: `chore/shared-planner-governance`
Base: `main`
Files introduced:
- `AGENTS.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`
- `.planning/DECISIONS.md`
- `.planning/EVIDENCE.md`
Purpose:
- establish one shared execution state for ChatGPT planning/review and Codex execution.

## Current verification queue

### V-001 — Review PR #2 against planner invariants
Status: PENDING
Must capture:
- changed-file review
- contract/adapter architecture check
- identifier/canonical mapping check
- semantics/overclaim check
- build/type/test evidence
- PASS/BLOCKED outcome

Do not advance `STATE.md` to M2-S2 until V-001 is complete and reviewed.

### V-002 — PRE-UAT Shell stack normalization

Date: 2026-08-29
Status: VERIFIED LOCALLY; NOT DEPLOYED
Evidence:
- PR #4 (`feat/access-003-shell-auth-transport`) was reconciled with current `main` while
  preserving the Owner Command Center V3 presentation and the ACCESS-003 fail-closed boundary.
- PR #5 (`feat/runtime-002-secure-ops-gateway`) remains stacked on PR #4.
- The useful unique PR #2 artifacts were retained: the mock `OpsOwnerProjectionProvider` adapter
  and the detailed `ops_owner_projection.v1` consumer contract document.
- PR #2's temporary validation workflow history and duplicate contract definition were not ported.
- Node 22 local verification: lint, TypeScript, production build, and all tests passed.
- Static secret/authority checks remain covered by ACCESS-003 and RUNTIME-002 tests.

Interpretation:
- GitHub stack is review-ready. This is build-time evidence only; no production environment,
  runtime flag, secret, Supabase project, or deployment was changed.
