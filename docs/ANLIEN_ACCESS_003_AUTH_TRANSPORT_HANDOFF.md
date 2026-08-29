# ACCESS-003 Shell Authentication & Trusted Session Transport

## Outcome

ACCESS-003 selects the existing OpenAI Sites dispatcher identity as the Shell
authentication transport. It does not add Supabase Auth, OAuth, or a second
identity system to the Shell. The stable per-Site authenticated user subject is
read from `oai-authenticated-user-id` only inside the server boundary.

Production activation remains closed. No real Account link, Membership,
Entitlement, credential, or mapping is created by this package.

## Auth readiness matrix

| Dependency | Before | After build | Production |
| --- | --- | --- | --- |
| Shell authentication | PARTIAL — dispatcher helper existed but no access composition used it | READY — server derives the trusted subject from dispatcher headers | NOT DEPLOYED |
| Canonical Account linkage | PARTIAL — only Marketing/Loyalty/Ops Auth subjects were supported | BUILD READY — governed Platform auth-subject source plus resolver | NO REAL LINK CREATED |
| Session/JWT validation | PARTIAL — product JWTs exist independently; Shell has no product session | READY for Sites transport — dispatcher owns sign-in and injects identity | Hosting policy/activation pending |
| ACCESS-001 composition | MISSING | BUILD READY — server-only subject → Account → canonical access projection | NOT DEPLOYED |
| Browser authority boundary | PARTIAL — disabled adapter still modeled a caller-provided source tuple | READY — same-origin GET accepts no Account/source/product-local authority | NOT DEPLOYED |
| Business/Location/Entitlement checks | BUILD READY in Core | BUILD READY in BFF composition with isolation tests | NOT DEPLOYED |
| Product session handoff/SSO | MISSING | OUT OF SCOPE | ACCESS after Runtime Gateway |

## Audit conclusion

- Marketing, Loyalty, and Ops each retain independent Supabase Auth sessions.
- Their local memberships and roles remain product-owned and are not canonical
  authorization.
- The Shell already has dispatch-owned Sign in with ChatGPT helpers and stable
  per-Site user headers.
- The Shell has no Supabase Auth client and needs none for this access gate.
- Core already owns canonical Account, Membership, Entitlement, Business, and
  Location projection; ACCESS-003 adds only the missing trusted auth-subject
  link and composition.

## Trust flow

```text
Browser
→ OpenAI Sites dispatcher authentication
→ trusted oai-authenticated-user-id header
→ Shell GET /api/access-context
→ Core resolve_authenticated_canonical_account_v1
→ ACCESS-001 get_canonical_access_projection_v1
→ server verifies Membership + Ops Entitlement + Business + Location
→ authorized_owner_context.v1
```

The route rejects `account_id`, `canonical_account_id`, `source_*`,
`ops_organization_id`, and `ops_shop_id`. Canonical Business/Location selection
is allowed only as a request, then checked against the resolved Account's Core
projection.

## Contracts

Core:

- `authenticated_canonical_session.v1`
- `anlien_authenticated_access_context_v1`
- `resolve_authenticated_canonical_account_v1(...)`
- `get_authenticated_canonical_access_context_v1(...)`

Shell:

- `AuthorizedOwnerContextV1`
- `authorized_owner_context.v1`
- explicit auth/access failure states; no silent demo authorization

The Sites dispatcher does not expose issued/expiry timestamps in its forwarded
identity headers, so those contract fields are nullable. Invalid/expired
states remain explicit for auth providers that can attest them later. The
Shell never parses or trusts a browser-provided JWT.

## Threat analysis

- Account spoofing: no Account ID is accepted; Core derives it from a VERIFIED
  server-side auth-subject mapping.
- Tenant hopping/IDOR: requested Business and Location must exist in the
  resolved canonical projection; cross-Business selections fail closed.
- Token leakage: the browser receives no Core key. The server credential uses
  a non-public environment variable, is never logged, and calls one RPC.
- Header spoofing/direct-origin deployment: the route remains disabled unless
  the server-only `ANLIEN_AUTH_TRANSPORT=openai_sites_dispatcher` activation
  flag is present. That flag may be enabled only on the approved Sites runtime
  behind its dispatcher; it is not a browser trust signal.
- Privilege escalation: browser roles have no Core resolver grant; the BFF
  never accepts product-local Ops identifiers or local product roles.
- Demo confusion: authorization failures never become synthetic authorization.
  Demo presentation remains a separate public UI state.

## Remaining blockers

- Core Phase 3 production/UAT/policy gate is closed.
- No real Platform auth subject has been linked to a canonical Account.
- Hosted Shell server environment has no Core URL/service credential configured.
- The trusted dispatcher activation flag is not configured.
- Hosting access policy and production session behavior require activation UAT.
- Existing MUA Location mapping remains `PARENT_NOT_VERIFIED` for ACCESS-002.
- Ops Runtime Gateway is not implemented.

Recommendation: **GO for RUNTIME-002 build-time implementation**, while
remaining **NO-GO for production activation and live Ops data**.
