import { get, set } from "lodash/fp";

import sanityGraphqlApi from "../../sanity-graphql";
import { PortableTextJSON } from "../types/base";

type ObjectPath = string[];

/**
 * Given a portable text JSON blob, search for all objects that have
 * `{_type: "reference"}` and fetch and replace them with actual content
 */
export const resolveReferences = async (
  portableText: PortableTextJSON
): Promise<PortableTextJSON> => {
  /**
   * Find all paths to embedded references within the portable text, e.g.
   * [[0, 'image', 'asset'], [5, 'video']]
   * We hold onto this paths array so we can update them later
   */
  const pathsToUpdate = getAllPaths(portableText, isReference);

  /**
   * Grab the actual _ref for each of the paths and store in a tuple with the path
   */
  const pathsAndRefs: [ObjectPath, string][] = pathsToUpdate.map((path) => [
    path,
    get([...path, "_ref"], portableText),
  ]);

  const queryResults = await sanityGraphqlApi.blogPortableTextReferences({
    ids: pathsAndRefs.map(([, id]) => id),
  });

  /**
   * For each of the paths we found earlier, replace the _ref object at that
   * location with the result of the graphql query for it's data
   */
  const updated = pathsAndRefs.reduce((acc, [path, id]) => {
    const queryPart = queryResults.allDocument.find((doc) => doc._id === id);

    return set(path, queryPart)(acc);
  }, portableText);

  return updated;
};

const hasType = (data: unknown): data is { _type: string } => {
  return Boolean(data && typeof data === "object" && "_type" in data);
};

const isReference = (x: unknown): boolean => {
  return hasType(x) && x._type === "reference";
};

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
  prev: ObjectPath = []
): ObjectPath[] => {
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
