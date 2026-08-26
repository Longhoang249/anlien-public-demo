import type { AccessContext, BusinessAccess, ProductKey, ShellState } from "./shell";

export interface AccessContextAdapter {
  getAccessContext(): AccessContext;
}

// Future implementation boundary only. There is intentionally no concrete
// Core client, credential, request, session bridge, or runtime connection.
export interface CoreAccessContextAdapter extends AccessContextAdapter {
  readonly kind: "core-access-context";
  readonly connection: "not-configured";
}

export function getSelectedBusinessAccess(
  context: AccessContext,
  selectedBusinessId = context.selectedBusinessId,
): BusinessAccess | null {
  if (!selectedBusinessId) return null;
  return context.businesses.find(({ business }) => business.id === selectedBusinessId) ?? null;
}

export function isProductAvailable(
  context: AccessContext,
  product: ProductKey,
  selectedBusinessId = context.selectedBusinessId,
): boolean {
  const selected = getSelectedBusinessAccess(context, selectedBusinessId);
  return Boolean(
    context.account?.status === "active" &&
      selected?.business.status === "active" &&
      selected.membership.status === "active" &&
      selected.entitlements.some(
        (entitlement) => entitlement.product === product && entitlement.status === "active",
      ),
  );
}

export function getShellState(
  context: AccessContext,
  product?: ProductKey,
  selectedBusinessId = context.selectedBusinessId,
): ShellState {
  if (context.mode === "PUBLIC_DEMO") return "PUBLIC_DEMO";
  if (!context.account) return "SIGNED_IN_PLACEHOLDER";

  const selected = getSelectedBusinessAccess(context, selectedBusinessId);
  if (!selected || selected.membership.status !== "active") return "SIGNED_IN_PLACEHOLDER";
  if (!product) return "BUSINESS_SELECTED";

  return isProductAvailable(context, product, selectedBusinessId)
    ? "PRODUCT_AVAILABLE"
    : "PRODUCT_UNAVAILABLE";
}
