export type CanonicalOpsMappingState =
  | "VERIFIED"
  | "NOT_MAPPED"
  | "NOT_VERIFIED"
  | "DISABLED"
  | "AMBIGUOUS"
  | "CANONICAL_NOT_FOUND"
  | "PARENT_NOT_VERIFIED"
  | "BUSINESS_NOT_VERIFIED"
  | "CROSS_BUSINESS"
  | "CROSS_TENANT_MISMATCH"
  | "INVALID_INPUT";

export interface CanonicalOpsLocationMappingV1 {
  contract: "anlien_canonical_ops_mapping_v1";
  resolver: "canonical_location_to_ops_shop";
  state: CanonicalOpsMappingState;
  mapping_status: "VERIFIED" | "PENDING" | "DISABLED" | null;
  canonical_business_id: string | null;
  canonical_location_id: string | null;
  ops_organization_id: string | null;
  ops_shop_id: string | null;
  mapping_ref_id: string | null;
  verified_at: string | null;
}
