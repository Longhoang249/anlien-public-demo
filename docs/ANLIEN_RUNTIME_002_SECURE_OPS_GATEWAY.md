# RUNTIME-002 Secure Ops Gateway — Shell Handoff

**Status:** build-time complete; live provider disabled  
**Base:** Shell ACCESS-003

## Composition

```text
GET /api/ops-owner-projection
  → OpenAI Sites dispatcher subject (server only)
  → ACCESS-003 canonical Account
  → ACCESS-001 Membership + Ops Entitlement + Business/Location
  → ACCESS-002 canonical_location_to_ops_shop resolver
  → require VERIFIED mapping and exact parent provenance
  → mint 60-second ops_projection_access_grant.v1
  → POST Ops owner-projection-gateway
  → validate ops_owner_projection.v1
  → owner_ops_projection_result.v1
```

## Authority rules

Browser inputs are limited to canonical Business/Location selection and projection date. They are
checked against the canonical access projection. Browser-supplied Account, Ops organization/shop,
Membership, Entitlement or auth-subject parameters are rejected.

The provider accepts only an `AuthorizedOwnerContextV1`. It calls the backend-only ACCESS-002 resolver
and refuses `PARENT_NOT_VERIFIED`, `PENDING`, `DISABLED`, ambiguous, cross-Business or inconsistent
mappings. No Ops ID is inferred from a canonical ID.

## Runtime secrets and guards

Required only during a separately authorized activation:

```text
ANLIEN_OPS_LIVE_PROVIDER_ENABLED=true
ANLIEN_OPS_GATEWAY_URL=...
ANLIEN_OPS_GRANT_ISSUER=...
ANLIEN_OPS_GRANT_ACTIVE_KID=...
ANLIEN_OPS_GRANT_KEYS_JSON=...
```

All are server-only. No `NEXT_PUBLIC_` or browser-visible variant exists. The default is disabled and
the Shell cannot label demo data as live.

## Auth and data health

Authorization failures stop before mapping, grant issuance and Ops. They never become demo
authorization. After successful authorization, projection results use separate data states:

- `LIVE`: verified live projection;
- `STALE`: verified stale projection with its original `asOf`;
- `UNAVAILABLE`: provider/gateway/mapping unavailable;
- `ERROR`: authorization handoff, mapping consistency or response-contract failure.

The response validator binds projection date, canonical Business/Location and Ops organization/shop
to the grant scope. It rejects malformed versions and sensitive fields such as email, selfie/GPS,
evidence, raw Memberships, raw task rows, service-role material and auth subjects.

## Production status

No deployment, hosted environment change, Supabase/Auth mutation, real Account link, Membership,
Entitlement, mapping verification or production credential was created.
