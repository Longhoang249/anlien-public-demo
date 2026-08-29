const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const KID = /^[A-Za-z0-9._-]{1,64}$/;
const encoder = new TextEncoder();

export class OpsGrantIssuanceError extends Error {
  constructor(code) {
    super(code);
    this.name = "OpsGrantIssuanceError";
    this.code = code;
  }
}

export function encodeBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function decodeBase64Url(value) {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) throw new OpsGrantIssuanceError("INVALID_KEY");
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (value.length % 4)) % 4);
  try {
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  } catch {
    throw new OpsGrantIssuanceError("INVALID_KEY");
  }
}

async function hmac(data, key) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data)));
}

function signingKey(config) {
  if (!config || !KID.test(config.keyring?.activeKid ?? "")) {
    throw new OpsGrantIssuanceError("SIGNING_NOT_CONFIGURED");
  }
  const encoded = config.keyring.keys?.[config.keyring.activeKid];
  if (!encoded) throw new OpsGrantIssuanceError("SIGNING_NOT_CONFIGURED");
  const key = decodeBase64Url(encoded);
  if (key.byteLength < 32) throw new OpsGrantIssuanceError("INVALID_KEY");
  return key;
}

export function parseOpsGrantKeyring(activeKid, encodedKeys) {
  if (!activeKid || !encodedKeys) throw new OpsGrantIssuanceError("SIGNING_NOT_CONFIGURED");
  let keys;
  try {
    keys = JSON.parse(encodedKeys);
  } catch {
    throw new OpsGrantIssuanceError("SIGNING_NOT_CONFIGURED");
  }
  if (!keys || typeof keys !== "object" || Array.isArray(keys) || typeof keys[activeKid] !== "string") {
    throw new OpsGrantIssuanceError("SIGNING_NOT_CONFIGURED");
  }
  return { activeKid, keys };
}

export async function signOpsProjectionAccessGrantV1(claims, config) {
  const header = {
    alg: "HS256",
    typ: "ANLIEN-OPS-GRANT",
    kid: config.keyring.activeKid,
  };
  const encodedHeader = encodeBase64Url(encoder.encode(JSON.stringify(header)));
  const encodedClaims = encodeBase64Url(encoder.encode(JSON.stringify(claims)));
  const signed = `${encodedHeader}.${encodedClaims}`;
  const signature = await hmac(signed, signingKey(config));
  return `${signed}.${encodeBase64Url(signature)}`;
}

export async function mintOpsProjectionAccessGrantV1(input, config, options = {}) {
  const context = input.authorizedContext;
  const mapping = input.mapping;
  const locationId = input.canonicalLocationId;
  if (
    !context ||
    !UUID.test(context.canonicalAccountId ?? "") ||
    !UUID.test(context.canonicalBusinessId ?? "") ||
    !context.canonicalLocationIds?.includes(locationId) ||
    !context.productEntitlements?.includes("ops")
  ) {
    throw new OpsGrantIssuanceError("CANONICAL_AUTHORIZATION_REQUIRED");
  }
  if (
    mapping?.contract !== "anlien_canonical_ops_mapping_v1" ||
    mapping?.resolver !== "canonical_location_to_ops_shop" ||
    mapping?.state !== "VERIFIED" ||
    mapping?.mapping_status !== "VERIFIED" ||
    mapping.canonical_business_id !== context.canonicalBusinessId ||
    mapping.canonical_location_id !== locationId ||
    !UUID.test(mapping.ops_organization_id ?? "") ||
    !UUID.test(mapping.ops_shop_id ?? "")
  ) {
    throw new OpsGrantIssuanceError("VERIFIED_MAPPING_REQUIRED");
  }
  if (!DATE.test(input.projectionDate ?? "")) {
    throw new OpsGrantIssuanceError("INVALID_PROJECTION_DATE");
  }

  const now = options.now ?? new Date();
  const ttlSeconds = Math.min(Math.max(config.ttlSeconds ?? 60, 15), 120);
  const claims = {
    contract: "ops_projection_access_grant.v1",
    version: 1,
    issuer: config.issuer,
    audience: "ops-owner-projection-gateway",
    canonicalAccountId: context.canonicalAccountId,
    canonicalBusinessId: context.canonicalBusinessId,
    canonicalLocationId: locationId,
    opsOrganizationId: mapping.ops_organization_id,
    opsShopId: mapping.ops_shop_id,
    entitlement: "ops",
    projectionDate: input.projectionDate,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlSeconds * 1000).toISOString(),
    jti: options.jti ?? crypto.randomUUID(),
  };
  if (!config.issuer || !UUID.test(claims.jti)) {
    throw new OpsGrantIssuanceError("SIGNING_NOT_CONFIGURED");
  }
  return {
    assertion: await signOpsProjectionAccessGrantV1(claims, config),
    claims,
  };
}
