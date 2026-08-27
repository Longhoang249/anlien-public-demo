import type { ProductKey } from "./shell";

export interface CoreAccessProductProjection {
  product: ProductKey;
  entitlement_id: string | null;
  entitlement_status: "active" | "inactive" | "missing";
  available: boolean;
}

export interface CoreAccessBusinessProjection {
  business: {
    id: string;
    organization_id: string;
    display_name: string;
    status: "active";
  };
  membership: {
    id: string;
    status: "active";
  };
  products: CoreAccessProductProjection[];
}

export interface CoreAccessProjectionV1 {
  contract: "anlien_access_projection_v1";
  state: "READY" | "ACCOUNT_UNRESOLVED" | "ACCOUNT_INACTIVE" | "NO_ACTIVE_MEMBERSHIP";
  generated_at: string;
  account: {
    id: string;
    status: "active" | "inactive";
  } | null;
  businesses: CoreAccessBusinessProjection[];
}

export interface CoreAccessProjectionRequest {
  source_product: "marketing" | "loyalty" | "ops";
  source_system_id: string;
  source_entity_type: "auth.users";
  source_entity_id: string;
}
