import gql from "graphql-tag";
import { update, get, set } from "lodash/fp";

import { sanityGraphqlClient } from "../../sanity-graphql";

/**
 * Find the first occurrence of a k/v pair that return true for the
 * `matcher` predicate
 */
export function getPath(
  obj: Record<string, unknown>,
  matcher: any
): string[] | undefined {
  for (const key in obj) {
    if (matcher(key, obj[key])) {
      return [key];
    } else if (obj[key] && typeof obj[key] === "object") {
      const result = getPath(obj[key], matcher);

      if (result) {
        result.unshift(key);
        return result;
      }
    }
  }
}

/**
 * Find all paths to k/v pairs that return true from the `matcher`
 * predicate.
 */
export function getAllPaths(obj: object, matcher: any, path: string[] = []) {
  const nextFullPath = getPath(obj, matcher);

  if (!nextFullPath) {
    return path;
  }

  const nextPath = nextFullPath;
  const next = update(nextPath.slice(0, -1), () => null)(obj);
  return getAllPaths(next, matcher, [...path, nextPath]);
}

/**
 * Given a portable text JSON blob, search for all objects that have
 * `{_type: "reference"}` and replace them with actual content
 */
export const resolveReferences = async (obj: Record<string, unknown>) => {
  const matcher = (k: string, v: unknown) => {
    return v && typeof v === "object" && v?._type === "reference";
  };

  // Find all paths to embedded references
  // We hold onto this paths array so we can update them later
  const pathsToUpdate = getAllPaths(obj, matcher);

  // Grab the actual { _ref }
  const referenceObjects = pathsToUpdate.map((path: string[]) =>
    get(path, obj)
  ) as Array<{ _ref: string }>;

  /**
   * Construct a graphql query where the keys are the indices
   * are the same as the path they correspond to
   *
   * @TODO: Instead of dynamically constructing the fragments, define a document.gql
   * and call that in batch mode instead?
   * https://github.com/prisma-labs/graphql-request#batching
   */
  const queryList = referenceObjects.map(
    (refObj, index) => `_${index}: Document(id: "${refObj._ref}") {
      _id
      _type
      ...on Webinar {
        slug { current }
      }
      ... on SanityImageAsset {
        _id
        url
      }
    }`
  );

  const query = gql`
      query {
        ${queryList.join("\n")}
      }
    `;

  const queryRes = await sanityGraphqlClient.request(query);

  // Stitch back up our returned data with the original
  const updated = pathsToUpdate.reduce((acc, path, index) => {
    const queryPart = queryRes[`_${index}`];

    return set(path, queryPart)(acc);
  }, obj);

  return updated;
};
