# ANLIEN Shell Sprint 2 — Private Access Handoff

## Build outcome

Sprint 2 adds a fail-closed, disabled-by-default Core access adapter contract and a synthetic private-workspace preview at `/workspace`. The public showroom remains independent and continues to use its deterministic demo fixture.

## Runtime boundary

- `CoreAccessContextAdapter` is concrete but disabled by default.
- Activation requires an explicit trusted endpoint and exact source tuple.
- The adapter sends no Authorization header, cookie, service-role key, or product session.
- Invalid, unavailable, unresolved, membership-less, and entitlement-less states fail closed.
- No public client imports the disabled adapter. A trusted application boundary must own the future Core call.
- Product destinations remain `null`; the UI never invents URLs or transfers a session.
- Marketing, Loyalty, and Ops retain independent product sign-in until separately approved.

## Projection states exercised

The synthetic preview exercises one Business, multiple Businesses, inactive Membership, no Entitlement, unauthenticated Account, Core unavailable, and adapter error. It displays Account → selected Business → product availability without product-domain records.

## Deliberately deferred

- Core endpoint configuration and authentication
- production Account resolution
- product deep-link configuration
- Shell/product SSO or session handoff
- runtime PostgreSQL/RLS verification
- browser end-to-end verification
- deployment and activation

The existing Marketing R3B runtime smoke debt remains independent of this Shell/Core build and must not block static integration readiness.
