import { getChatGPTUser } from "@/app/chatgpt-auth";
import type { AuthorizedOwnerContextEnvelopeV1 } from "@/src/contracts/core-access-api";
import { authorizeOwnerContextV1 } from "@/src/server/authorize-owner-context.mjs";
import {
  CanonicalAccessUnavailableError,
  getAuthenticatedCoreAccess,
} from "@/src/server/core-authenticated-access-client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const FORBIDDEN_AUTHORITY_INPUTS = [
  "account_id",
  "canonical_account_id",
  "ops_organization_id",
  "ops_shop_id",
  "source_product",
  "source_system_id",
  "source_entity_id",
];

function json(body: AuthorizedOwnerContextEnvelopeV1 | { error: string }, status: number) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "private, no-store" },
  });
}

export async function GET(request: Request) {
  if (process.env.ANLIEN_AUTH_TRANSPORT !== "openai_sites_dispatcher") {
    return json(
      {
        contract: "authorized_owner_context.v1",
        state: "CANONICAL_ACCESS_UNAVAILABLE",
        context: null,
        access: null,
      },
      503,
    );
  }

  const url = new URL(request.url);
  if (FORBIDDEN_AUTHORITY_INPUTS.some((key) => url.searchParams.has(key))) {
    return json({ error: "Authority identifiers are server-derived" }, 400);
  }

  const canonicalBusinessId = url.searchParams.get("business_id") ?? undefined;
  const canonicalLocationId = url.searchParams.get("location_id") ?? undefined;
  if (
    (canonicalBusinessId && !UUID.test(canonicalBusinessId)) ||
    (canonicalLocationId && !UUID.test(canonicalLocationId))
  ) {
    return json({ error: "Invalid canonical selection" }, 400);
  }

  const user = await getChatGPTUser();
  if (!user) {
    return json(
      {
        contract: "authorized_owner_context.v1",
        state: "UNAUTHENTICATED",
        context: null,
        access: null,
      },
      401,
    );
  }

  try {
    const core = await getAuthenticatedCoreAccess(user.userId);
    const result = authorizeOwnerContextV1(core, {
      canonicalBusinessId,
      canonicalLocationId,
    }) as AuthorizedOwnerContextEnvelopeV1;
    return json(result, result.state === "AUTHORIZED" ? 200 : 403);
  } catch (error) {
    if (!(error instanceof CanonicalAccessUnavailableError)) {
      // Deliberately do not log the error: transport failures may contain
      // request metadata and must never disclose tokens or auth subjects.
    }
    return json(
      {
        contract: "authorized_owner_context.v1",
        state: "CANONICAL_ACCESS_UNAVAILABLE",
        context: null,
        access: null,
      },
      503,
    );
  }
}
