import type { AuthenticatedCoreAccessContextV1 } from "@/src/contracts/core-access-api";

const AUTH_PROVIDER = "openai_sites";
const AUTH_SYSTEM_ID = "appgprj_6a7d37986d08819199ca2e7fb0081a5d";

export class CanonicalAccessUnavailableError extends Error {
  constructor() {
    super("Canonical access is unavailable");
    this.name = "CanonicalAccessUnavailableError";
  }
}

export async function getAuthenticatedCoreAccess(
  authSubject: string,
): Promise<AuthenticatedCoreAccessContextV1> {
  const coreUrl = process.env.ANLIEN_CORE_SUPABASE_URL;
  const serviceRoleKey = process.env.ANLIEN_CORE_SERVICE_ROLE_KEY;
  if (!coreUrl || !serviceRoleKey || !authSubject) {
    throw new CanonicalAccessUnavailableError();
  }

  let endpoint: URL;
  try {
    endpoint = new URL(
      "/rest/v1/rpc/get_authenticated_canonical_access_context_v1",
      coreUrl,
    );
  } catch {
    throw new CanonicalAccessUnavailableError();
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        p_auth_provider: AUTH_PROVIDER,
        p_auth_system_id: AUTH_SYSTEM_ID,
        p_auth_subject: authSubject,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new CanonicalAccessUnavailableError();
    return (await response.json()) as AuthenticatedCoreAccessContextV1;
  } catch (error) {
    if (error instanceof CanonicalAccessUnavailableError) throw error;
    throw new CanonicalAccessUnavailableError();
  }
}
