import gql from "graphql-tag";
import { get, set } from "lodash/fp";
import { GraphQLClient } from "graphql-request";

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
 * This is defined inline here as our .gql files are compiled with graphql-tag
 * when ran via codegen, so we'd need an extra step to undo that if co-locating this query
 * with the others before we can join them together
 */
const getDocumentReferencesQuery = (
  id: string
) => /* GraphQL */ `Document(id: "${id}") {
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
}`;

export const batchGraphqlRequests = async <Res extends []>(
  client: GraphQLClient,
  queries: string[]
): Promise<Res[]> => {
  /**
   * Batch together the list of given queries by combining them into one query
   * where the keys are the indices of the query they correspond to, e.g.
   * ```
   * _0: Document(id: abcdef) {
   * }
   * _1: Document(id: ghijkl) {}
   * ```
   *
   * Ideally instead of dynamically constructing the query we could use graphql
   * request batching, but sanity's implementation doesn't seem to support this
   * https://github.com/prisma-labs/graphql-request#batching
   */
  const query = gql`
    query {
      ${queries.map((query, index) => `_${index}: ${query}`).join("\n")}
    }
  `;

  const queryRes = await client.request(query);

  // Unwrap the queries from {_1:.., _2:..} etc into an array
  return queries.map((_, index) => {
    return queryRes[`_${index}`];
  });
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

  const queryList = referenceObjects.map((refObj) =>
    getDocumentReferencesQuery(refObj._ref)
  );

  const queryResults = await batchGraphqlRequests(
    sanityGraphqlClient,
    queryList
  );

  /**
   * For each of the paths we found earlier, replace the _ref at that
   * location with the result of the graphql query for it's data
   */
  const updated = pathsToUpdate.reduce((acc, path, index) => {
    const queryPart = queryResults[index];

    return set(path, queryPart)(acc);
  }, obj);

  return updated;
};
