import type { ProductKey } from "./shell";

export type CanonicalSessionState =
  | "AUTHENTICATED"
  | "UNAUTHENTICATED"
  | "ACCOUNT_NOT_LINKED"
  | "ACCOUNT_INACTIVE"
  | "SESSION_INVALID"
  | "SESSION_EXPIRED"
  | "AMBIGUOUS_ACCOUNT";

export interface AuthenticatedCanonicalSessionV1 {
  authenticated: true;
  canonical_account_id: string;
  auth_subject: string;
  issued_at: string | null;
  expires_at: string | null;
}

export interface CanonicalBusinessV1 {
  id: string;
  organization_id: string;
  display_name: string;
  status: "active";
}

export interface CanonicalMembershipV1 {
  id: string;
  account_id: string;
  business_id: string;
  status: "active";
}

export interface CanonicalEntitlementV1 {
  id: string | null;
  business_id: string;
  product: ProductKey;
  status: "active" | "inactive" | "missing";
  available: boolean;
}

export interface CanonicalLocationV1 {
  id: string;
  business_id: string;
  display_name: string;
  status: "active";
}

export interface CanonicalAccessProjectionV1 {
  contract: "anlien_canonical_access_projection_v1";
  state:
    | "AUTHENTICATED_AUTHORIZED"
    | "AUTHENTICATED_NO_MEMBERSHIP"
    | "AUTHENTICATED_INACTIVE_MEMBERSHIP"
    | "AUTHENTICATED_NO_ENTITLEMENT"
    | "ACCOUNT_INACTIVE"
    | "UNKNOWN_ACCOUNT";
  generated_at: string;
  account: { id: string; status: "active" | "inactive" } | null;
  businesses: CanonicalBusinessV1[];
  memberships: CanonicalMembershipV1[];
  entitlements: CanonicalEntitlementV1[];
  locations: CanonicalLocationV1[];
}

export interface AuthenticatedCoreAccessContextV1 {
  contract: "anlien_authenticated_access_context_v1";
  state: CanonicalSessionState;
  session: AuthenticatedCanonicalSessionV1 | null;
  access: CanonicalAccessProjectionV1 | null;
}

export type AuthorizedOwnerFailure =
  | "UNAUTHENTICATED"
  | "ACCOUNT_NOT_LINKED"
  | "ACCOUNT_INACTIVE"
  | "SESSION_INVALID"
  | "SESSION_EXPIRED"
  | "AMBIGUOUS_ACCOUNT"
  | "NO_MEMBERSHIP"
  | "NO_ENTITLEMENT"
  | "LOCATION_NOT_AUTHORIZED"
  | "CANONICAL_ACCESS_UNAVAILABLE";

export interface AuthorizedOwnerContextV1 {
  canonicalAccountId: string;
  canonicalBusinessId: string;
  canonicalLocationIds: string[];
  productEntitlements: ProductKey[];
}

export type AuthorizedOwnerContextEnvelopeV1 =
  | {
      contract: "authorized_owner_context.v1";
      state: "AUTHORIZED";
      context: AuthorizedOwnerContextV1;
      access: CanonicalAccessProjectionV1;
    }
  | {
      contract: "authorized_owner_context.v1";
      state: AuthorizedOwnerFailure;
      context: null;
      access: null;
    };
