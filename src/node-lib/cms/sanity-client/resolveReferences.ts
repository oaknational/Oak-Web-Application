import gql from "graphql-tag";
import { get, set } from "lodash/fp";

import { sanityGraphqlClient } from "../../sanity-graphql";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !Array.isArray(value) && typeof value === "object" && value !== null;
}

/**
 * Deeply search an object for each value that matches
 * the provided predicate, returning the path for each
 * match as an array
 *
 * @example
 * getAllPaths({foo: [{bar: 'baz'}]}, x => x.bar === 'baz')
 * // => [['foo', '0', 'bar']]
 */
export const getAllPaths = (
  obj: Record<string, unknown> | Record<string, unknown>[],
  pred: (v: unknown) => boolean,
  prev: string[] = []
): string[][] => {
  const result = [];

  for (const [key, value] of Object.entries(obj)) {
    const path = [...prev, key];

    if (pred(value)) {
      result.push(path);
    } else if (value && (Array.isArray(value) || isRecord(value))) {
      result.push(...getAllPaths(value, pred, path));
    }
  }

  return result;
};

const hasType = (data: unknown): data is { _type: string } => {
  return Boolean(data && typeof data === "object" && "_type" in data);
};

const isReference = (x: unknown): boolean => {
  return hasType(x) && x._type === "reference";
};

/**
 * Given a portable text JSON blob, search for all objects that have
 * `{_type: "reference"}` and fetch and replace them with actual content
 */
export const resolveReferences = async (obj: Record<string, unknown>) => {
  /**
   * Find all paths to embedded references within the portable text, e.g.
   * [[0, 'image', 'asset'], [5, 'video']]
   * We hold onto this paths array so we can update them later
   */
  const pathsToUpdate = getAllPaths(obj, isReference);

  // Grab the actual { _ref } for each of the paths
  const referenceObjects = pathsToUpdate.map((path: string[]) =>
    get(path, obj)
  ) as Array<{ _ref: string }>;

  /**
   * Construct a graphql query for each of the referenced documents,
   * where the keys are the indices of the path they correspond to, e.g.
   * ```
   * _0: Document(id: abcdef) {
   * }
   * _1: Document(id: ghijkl) {}
   * ```
   *
   * @TODO: Instead of dynamically constructing the fragments, define a document.gql
   * and call that in batch mode instead?
   * https://github.com/prisma-labs/graphql-request#batching
   */
  const queryList = referenceObjects.map(
    (
      refObj,
      index
    ) => /* GraphQL */ `_${index}: Document(id: "${refObj._ref}") {
      _id
      _type
      __typename
      ...on Webinar {
        slug { current }
      }
      ... on SanityImageAsset {
        url
      }
      ... on Video {
        video {
          asset {
            playbackId
            assetId
          }
        }
      }
    }`
  );

  const query = gql`
      query {
        ${queryList.join("\n")}
      }
    `;

  const queryRes = await sanityGraphqlClient.request(query);

  /**
   * For each of the paths we found earlier, replace the _ref at that
   * location with the result of the graphql query for it's data
   */
  const updated = pathsToUpdate.reduce((acc, path, index) => {
    const queryPart = queryRes[`_${index}`];

    return set(path, queryPart)(acc);
  }, obj);

  return updated;
};
