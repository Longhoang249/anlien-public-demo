export async function getOwnerOpsProjection(input, dependencies) {
  let core;
  try {
    core = await dependencies.getAuthenticatedCoreAccess(input.authSubject);
  } catch {
    return {
      contract: "owner_ops_projection_composition.v1",
      authorization: { state: "CANONICAL_ACCESS_UNAVAILABLE" },
      data: null,
    };
  }

  const authorization = dependencies.authorizeOwnerContextV1(core, {
    canonicalBusinessId: input.canonicalBusinessId,
    canonicalLocationId: input.canonicalLocationId,
  });
  if (authorization.state !== "AUTHORIZED") {
    return {
      contract: "owner_ops_projection_composition.v1",
      authorization: { state: authorization.state },
      data: null,
    };
  }

  const data = await dependencies.provider.getOwnerProjection({
    authorizedContext: authorization.context,
    canonicalLocationId: input.canonicalLocationId,
    projectionDate: input.projectionDate,
  });
  return {
    contract: "owner_ops_projection_composition.v1",
    authorization: { state: "AUTHORIZED" },
    data,
  };
}
