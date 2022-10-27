import { get, update } from "lodash/fp";

import OakError from "../../../errors/OakError";
import { getHubspotFormById } from "../../hubspot-forms";

type ObjectPath = string[];

/**
 * Given a portable text JSON blob, search for all objects that have
 * `{_type: "reference"}` and fetch and replace them with actual content
 */
export const resolveHubspotFromReferences = async <
  T extends Record<string, unknown> | Record<string, unknown>[]
>(
  document: T
): Promise<T> => {
  /**
   * Find all paths to embedded references within the document, e.g.
   * [[0, 'sidebar', 'sidebarForm'], [5, 'formBlock']]
   * We hold onto this paths array so we can update them later
   */
  const pathsToUpdate = getAllPaths(document, isHubspotFormObject);

  /**
   * Grab the actual _ref for each of the paths and store in a tuple with the path
   */
  const pathsAndRefs: [ObjectPath, { id: string }][] = pathsToUpdate.map(
    (path) => [path, get([...path, "hubspotForm"], document)]
  );

  // doc is tuple of [id, resolved form]
  const queryResults = (
    await Promise.allSettled(
      pathsAndRefs.map(async ([, formRef]) => {
        const actualForm = await getHubspotFormById(formRef.id);
        // TODO: loudly log error
        return [formRef.id, actualForm];
      })
    )
  ).map((result) => (result.status === "fulfilled" ? result.value : null));

  /**
   * For each of the paths we found earlier, replace the _ref object at that
   * location with the result of the graphql query for it's data
   */
  const updated = pathsAndRefs.reduce((acc, [path, formRef]) => {
    const queryPart = queryResults.find(([foundId]) => {
      return foundId === formRef.id;
    })?.[1];

    if (!queryPart) {
      /**
       * If you're getting errors here make sure:
       * - You've checked you're fetching the correct data in blogPortableTextReferences.gql
       * - You've ran gql-codegen:sanity
       * - Checked they're covered in portableTextReferencedEntrySchema
       */
      throw new OakError({
        code: "cms/invalid-form-reference",
        meta: {
          portableTextPath: path,
          portableTextRefId: formRef,
          queryResults: JSON.stringify(queryResults.allDocument),
        },
      });
    }

    return update(path, (data) => ({ ...data, hubspotForm: queryPart }), acc);
  }, document);

  return updated;
};

const isHubspotFormObject = (entry: unknown): boolean => {
  if (entry?.hubspotForm) {
    return true;
  }
  return false;
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
