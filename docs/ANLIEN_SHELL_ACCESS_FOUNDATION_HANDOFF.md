# ANLIEN Shell Access Foundation Handoff

## Scope and baseline

- Repository: `Longhoang249/anlien-public-demo`
- Starting `main`: `5502a117f94b5c681bcd55376fb76b707476ec4f`
- Feature branch: `phase3/fast-track-shell-foundation`
- Delivery mode: synthetic UI and typed contracts only; no production deploy

This branch adds an entitlement-aware Shell foundation while preserving the
existing Owner Command Center, “Nắm quán. Chốt việc.” hero, “Cần bạn xử lý”
priority flow, and independent Marketing/Loyalty/Ops summary adapters.

## Implemented contract

The Shell declares five explicit states:

- `PUBLIC_DEMO`
- `SIGNED_IN_PLACEHOLDER`
- `BUSINESS_SELECTED`
- `PRODUCT_AVAILABLE`
- `PRODUCT_UNAVAILABLE`

`AccessContextAdapter` is the only source boundary used by the Shell. The demo
implementation returns deterministic synthetic data. `CoreAccessContextAdapter`
is deliberately interface-only with `connection: "not-configured"`; there is
no Core credential, SDK client, fetch call, session bridge, SSO, or browser-to-
database path.

## Synthetic experience

- Synthetic Account: `Demo Owner`
- Primary Business: `FnB Ăn Liền (Demo quán)` with all three products enabled
- Secondary Business: `Bếp thử nghiệm (Demo)` with Marketing disabled and
  Loyalty/Ops enabled
- The Business switcher demonstrates one Account with multiple Memberships.
- The launcher labels each product `Available` or `Not enabled` from the
  selected Business Entitlements.
- All copy clearly identifies the access context as synthetic/demo behavior.

The launcher URLs remain product-owned demo routes. No product database is
queried, no product session is created, and no product-native role is inferred
from Core Membership.

## Verification status

- Access foundation static tests: PASS
- Existing rendered-route suite: PASS after build
- TypeScript/build/lint: recorded in the sprint report
- Local preview: `GET /` returned HTTP 200
- Core-backed Access Context integration:
  `DEFERRED_TO_MILESTONE_INTEGRATION_TEST`
- Authenticated SSO/session handoff:
  `DEFERRED_TO_MILESTONE_INTEGRATION_TEST`

Deferred paths are not treated as PASS.

## Future wiring boundary

A later milestone may supply a trusted backend implementation of
`CoreAccessContextAdapter`. It must consume a versioned Core response, map it
into the typed Shell contract, fail closed on missing/invalid context, and keep
all product launches behind an explicit session or handoff design. It must not
introduce direct cross-product database coupling.

## Rollback

No production rollback is needed because this branch is code-only and is not
deployed. Discarding the feature branch returns the public demo to the starting
commit without touching `main` or production.
