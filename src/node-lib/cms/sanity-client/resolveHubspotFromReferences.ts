import { get, update } from "lodash/fp";

import OakError from "../../../errors/OakError";
import errorReporter from "../../../common-lib/error-reporter";
import { getHubspotFormById } from "../../hubspot-forms";
import { FormDefinition } from "../../../common-lib/forms/FormDefinition";

import { getAllPaths, isRecord } from "./getAllPaths";

type ObjectPath = string[];

const reportError = errorReporter("resolveHubspotFormReferences.ts");

/**
 * Given a portable text JSON blob, search for all objects that have
 * `{_type: "reference"}` and fetch and replace them with actual content
 */
export const resolveHubspotFromReferences = async <
  T extends Record<string, unknown> | Record<string, unknown>[],
>(
  document: T,
): Promise<T> => {
  /**
   * Find all paths to embedded references within the document, e.g.
   * [[0, 'sidebar', 'sidebarForm'], [5, 'formBlock']]
   * We hold onto this paths array so we can update them later
   */
  const pathsToUpdate = getAllPaths(document, hasHubspotFormKey);

  /**
   * Grab the actual hubspotForm object for each of the paths
   * and store in a tuple with the path
   */
  const pathsAndRefs: [ObjectPath, { id: string }][] = pathsToUpdate.map(
    (path) => [path, get([...path, "hubspotForm"], document)],
  );

  /**
   * Fetch the matching form for each referenced ID, returning
   * an array of tuples with the shape [id, resolved form]
   *
   * Making use of Promise.allSettled instead of Promise.all
   * as we'd rather provide a slightly degraded experience without
   * forms (but loudly warn)
   *
   * For now this ignores any errors, but we may want to differentiate
   * between 404s and actual bugs
   */
  const formResults = await Promise.all(
    pathsAndRefs.map(
      async ([, formRef]): Promise<[string, FormDefinition | null]> => {
        try {
          const actualForm = await getHubspotFormById(formRef.id);

          return [formRef.id, actualForm];
        } catch (err) {
          const error = new OakError({
            code: "cms/invalid-hubspot-form",
            originalError: err,
            meta: {
              hubspotFormId: formRef.id,
              // We might not always be looking at a sanity document,
              // but if we are try to provide the additional context
              // for debugging
              sanityDocumentId: "id" in document ? document.id : undefined,
            },
          });
          reportError(error);

          return [formRef.id, null];
        }
      },
    ),
  );

  /**
   * For each of the paths we found earlier, replace the _ref object at that
   * location with the result of the graphql query for it's data
   */
  const updated = pathsAndRefs.reduce((acc, [path, formRef]) => {
    const matchingForm = formResults.find(([foundId]) => {
      return foundId === formRef.id;
    })?.[1];

    return update(
      path,
      (data) => ({ ...data, hubspotForm: matchingForm }),
      acc,
    );
  }, document);

  return updated;
};

const hasHubspotFormKey = (entry: unknown): boolean => {
  if (isRecord(entry) && entry.hubspotForm) {
    return true;
  }
  return false;
};
