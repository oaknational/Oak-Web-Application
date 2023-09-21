import { get, update } from "lodash/fp";
import { z } from "zod";

import OakError from "../../../errors/OakError";
import sanityGraphqlApi from "../../sanity-graphql";
import { portableTextReferencedEntrySchema } from "../../../common-lib/cms-types";

import { getAllPaths } from "./getAllPaths";

export type ObjectPath = string[];

const referencedDocumentsSchema = z.array(portableTextReferencedEntrySchema);

/**
 * Given a portable text JSON blob, search for all objects that have
 * `{_type: "reference"}` and fetch and replace them with actual content
 *
 * This is needed as portable text JSON is returned from the graphql endpoint
 * with un-resolved references to other documents. resolveSanityReferences does
 * a deep search for these references within a provided object/array of objects
 * and does a batch query for all references, then replaces said references
 * with their expanded forms. (e.g. slugs for pages so we can construct links)
 */
export const resolveSanityReferences = async <
  T extends Record<string, unknown> | Record<string, unknown>[],
>(
  portableText: T,
): Promise<T> => {
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

  const queryResults = await sanityGraphqlApi.portableTextReferences({
    ids: pathsAndRefs.map(([, id]) => id),
  });

  const parsedResults = referencedDocumentsSchema.parse(
    queryResults.allDocument,
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
       * - You've checked you're fetching the correct data in portableTextReferences.gql
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
