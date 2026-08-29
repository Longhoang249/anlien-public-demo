const PRODUCTS = new Set(["marketing", "loyalty", "ops"]);

function failure(state) {
  return {
    contract: "authorized_owner_context.v1",
    state,
    context: null,
    access: null,
  };
}

function isCanonicalAccess(access) {
  return Boolean(
    access &&
      access.contract === "anlien_canonical_access_projection_v1" &&
      Array.isArray(access.businesses) &&
      Array.isArray(access.memberships) &&
      Array.isArray(access.entitlements) &&
      Array.isArray(access.locations),
  );
}

/**
 * Pure authorization composition. Authentication evidence has already been
 * validated by the trusted server and resolved by Core. The browser never
 * supplies a canonical Account ID to this function.
 */
export function authorizeOwnerContextV1(core, selection = {}) {
  if (!core || core.contract !== "anlien_authenticated_access_context_v1") {
    return failure("CANONICAL_ACCESS_UNAVAILABLE");
  }

  if (core.state !== "AUTHENTICATED") {
    const known = new Set([
      "UNAUTHENTICATED",
      "ACCOUNT_NOT_LINKED",
      "ACCOUNT_INACTIVE",
      "SESSION_INVALID",
      "SESSION_EXPIRED",
      "AMBIGUOUS_ACCOUNT",
    ]);
    return failure(known.has(core.state) ? core.state : "CANONICAL_ACCESS_UNAVAILABLE");
  }

  const access = core.access;
  if (!core.session?.canonical_account_id || !isCanonicalAccess(access)) {
    return failure("CANONICAL_ACCESS_UNAVAILABLE");
  }
  if (access.account?.id !== core.session.canonical_account_id) {
    return failure("CANONICAL_ACCESS_UNAVAILABLE");
  }
  if (access.state === "ACCOUNT_INACTIVE") return failure("ACCOUNT_INACTIVE");
  if (
    access.state === "AUTHENTICATED_NO_MEMBERSHIP" ||
    access.state === "AUTHENTICATED_INACTIVE_MEMBERSHIP"
  ) {
    return failure("NO_MEMBERSHIP");
  }
  if (access.state === "AUTHENTICATED_NO_ENTITLEMENT") {
    return failure("NO_ENTITLEMENT");
  }
  if (access.state !== "AUTHENTICATED_AUTHORIZED") {
    return failure("CANONICAL_ACCESS_UNAVAILABLE");
  }

  const business = selection.canonicalBusinessId
    ? access.businesses.find((candidate) => candidate.id === selection.canonicalBusinessId)
    : access.businesses[0];
  if (!business) return failure("NO_MEMBERSHIP");

  const membership = access.memberships.find(
    (candidate) =>
      candidate.account_id === core.session.canonical_account_id &&
      candidate.business_id === business.id &&
      candidate.status === "active",
  );
  if (!membership) return failure("NO_MEMBERSHIP");

  const activeProducts = access.entitlements
    .filter(
      (candidate) =>
        candidate.business_id === business.id &&
        candidate.status === "active" &&
        candidate.available === true &&
        PRODUCTS.has(candidate.product),
    )
    .map((candidate) => candidate.product);
  if (!activeProducts.includes("ops")) return failure("NO_ENTITLEMENT");

  const businessLocations = access.locations.filter(
    (candidate) => candidate.business_id === business.id && candidate.status === "active",
  );
  if (
    selection.canonicalLocationId &&
    !businessLocations.some((candidate) => candidate.id === selection.canonicalLocationId)
  ) {
    return failure("LOCATION_NOT_AUTHORIZED");
  }

  const canonicalLocationIds = selection.canonicalLocationId
    ? [selection.canonicalLocationId]
    : businessLocations.map((candidate) => candidate.id);

  return {
    contract: "authorized_owner_context.v1",
    state: "AUTHORIZED",
    context: {
      canonicalAccountId: core.session.canonical_account_id,
      canonicalBusinessId: business.id,
      canonicalLocationIds,
      productEntitlements: activeProducts,
    },
    access,
  };
}
