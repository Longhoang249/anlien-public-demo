export interface OpsProjectionAccessGrantV1 {
  contract: "ops_projection_access_grant.v1";
  version: 1;
  issuer: string;
  audience: "ops-owner-projection-gateway";
  canonicalAccountId: string;
  canonicalBusinessId: string;
  canonicalLocationId: string;
  opsOrganizationId: string;
  opsShopId: string;
  entitlement: "ops";
  projectionDate: string;
  issuedAt: string;
  expiresAt: string;
  jti: string;
}

export interface OpsProjectionGrantKeyringV1 {
  activeKid: string;
  keys: Record<string, string>;
}
