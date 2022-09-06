import { get, update } from "lodash/fp";
import { z } from "zod";

import OakError from "../../../errors/OakError";
import sanityGraphqlApi from "../../sanity-graphql";
import { PortableTextJSON } from "../types/base";

import { portableTextReferencedEntrySchema } from "./schemas";

type ObjectPath = string[];

const referencedDocumentsSchema = z.array(portableTextReferencedEntrySchema);
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

  const parsedResults = referencedDocumentsSchema.parse(
    queryResults.allDocument
  );

  /**
   * For each of the paths we found earlier, replace the _ref object at that
   * location with the result of the graphql query for it's data
   */
  const updated = pathsAndRefs.reduce((acc, [path, id]) => {
    const queryPart = parsedResults.find((doc) => doc.id === id);

    if (!queryPart) {
      /**
       * If you're getting errors here make sure:
       * - You've checked you're fetching the correct data in blogPortableTextReferences.gql
       * - You've ran gql-codegen:sanity
       * - Checked they're covered in portableTextReferencedEntrySchema
       */
      throw new OakError({
        code: "cms/invalid-reference-data",
        meta: {
          portableTextPath: path,
          portableTextRefId: id,
          queryResults: JSON.stringify(queryResults.allDocument),
        },
      });
    }

    return update(path, (data) => ({ ...data, ...queryPart }), acc);
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
