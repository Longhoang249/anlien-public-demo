import type { ProductKey } from "@/src/contracts/shell";

export interface ProductDestination {
  productId: ProductKey;
  displayName: string;
  promise: string;
  demoHref: string;
  privateHref: string | null;
  privateHrefEnvironmentKey: string;
  authentication: "independent_product_sign_in";
  health: "unavailable";
}

export const productDestinations: Record<ProductKey, ProductDestination> = {
  marketing: {
    productId: "marketing",
    displayName: "Marketing",
    promise: "Kéo khách",
    demoHref: "/demo/marketing",
    privateHref: null,
    privateHrefEnvironmentKey: "ANLIEN_MARKETING_APP_URL",
    authentication: "independent_product_sign_in",
    health: "unavailable",
  },
  loyalty: {
    productId: "loyalty",
    displayName: "Loyalty",
    promise: "Giữ khách",
    demoHref: "/demo/loyalty",
    privateHref: null,
    privateHrefEnvironmentKey: "ANLIEN_LOYALTY_APP_URL",
    authentication: "independent_product_sign_in",
    health: "unavailable",
  },
  ops: {
    productId: "ops",
    displayName: "Ops",
    promise: "Vận hành tốt hơn",
    demoHref: "/demo/ops",
    privateHref: null,
    privateHrefEnvironmentKey: "ANLIEN_OPS_APP_URL",
    authentication: "independent_product_sign_in",
    health: "unavailable",
  },
};
