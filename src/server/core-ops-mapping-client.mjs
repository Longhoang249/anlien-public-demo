const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export class CoreOpsMappingError extends Error {
  constructor(reason, state = null) {
    super(reason);
    this.name = "CoreOpsMappingError";
    this.reason = reason;
    this.state = state;
  }
}

function isMapping(value, businessId, locationId) {
  return Boolean(
    value &&
      value.contract === "anlien_canonical_ops_mapping_v1" &&
      value.resolver === "canonical_location_to_ops_shop" &&
      value.canonical_business_id === businessId &&
      value.canonical_location_id === locationId,
  );
}

export async function resolveVerifiedOpsLocationMapping(input, config = {}) {
  if (!UUID.test(input.canonicalBusinessId ?? "") || !UUID.test(input.canonicalLocationId ?? "")) {
    throw new CoreOpsMappingError("MAPPING_INCONSISTENT", "INVALID_INPUT");
  }
  const coreUrl = config.coreUrl ?? process.env.ANLIEN_CORE_SUPABASE_URL;
  const serviceRoleKey = config.serviceRoleKey ?? process.env.ANLIEN_CORE_SERVICE_ROLE_KEY;
  if (!coreUrl || !serviceRoleKey) throw new CoreOpsMappingError("MAPPING_UNAVAILABLE");

  let endpoint;
  try {
    endpoint = new URL("/rest/v1/rpc/resolve_canonical_location_to_ops_shop_v1", coreUrl);
  } catch {
    throw new CoreOpsMappingError("MAPPING_UNAVAILABLE");
  }

  let response;
  try {
    response = await (config.fetchImpl ?? fetch)(endpoint, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        p_canonical_business_id: input.canonicalBusinessId,
        p_canonical_location_id: input.canonicalLocationId,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(config.timeoutMs ?? 5_000),
    });
  } catch {
    throw new CoreOpsMappingError("MAPPING_UNAVAILABLE");
  }
  if (!response.ok) throw new CoreOpsMappingError("MAPPING_UNAVAILABLE");

  let mapping;
  try {
    mapping = await response.json();
  } catch {
    throw new CoreOpsMappingError("MAPPING_INCONSISTENT");
  }
  if (!isMapping(mapping, input.canonicalBusinessId, input.canonicalLocationId)) {
    throw new CoreOpsMappingError("MAPPING_INCONSISTENT", mapping?.state ?? null);
  }
  if (mapping.state !== "VERIFIED" || mapping.mapping_status !== "VERIFIED") {
    throw new CoreOpsMappingError("MAPPING_UNAVAILABLE", mapping.state);
  }
  if (!UUID.test(mapping.ops_organization_id ?? "") || !UUID.test(mapping.ops_shop_id ?? "")) {
    throw new CoreOpsMappingError("MAPPING_INCONSISTENT", mapping.state);
  }
  return mapping;
}
