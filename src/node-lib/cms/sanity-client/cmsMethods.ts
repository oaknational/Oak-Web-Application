import { z } from "zod";

import sanityGraphqlApi from "../../sanity-graphql";

import { parseResults } from "./parseResults";
import { resolveHubspotFromReferences } from "./resolveHubspotFromReferences";
import { resolveSanityReferences } from "./resolveSanityReferences";

type GQLMethod = typeof sanityGraphqlApi[keyof typeof sanityGraphqlApi];

export type Params = {
  previewMode?: boolean;
};

export type ListParams = Params & {
  limit?: number;
};

/**
 * getBySlug, getSingleton and getList all exist to abstract the shared
 * logic between all CMS client methods, namely:
 *   1. Fetching the data with the correct params (inc preview checks)
 *   2. Plucking the key from the results
 *   3. Returning the appropriate fallback
 *   4. Parsing with the provided schema
 */

export const getBySlug = <
  Method extends GQLMethod,
  Response extends Awaited<ReturnType<Method>>,
  Data extends Record<string, unknown> | undefined,
  Schema extends z.ZodTypeAny
>(
  graphqlMethod: Method,
  schema: Schema,
  getResultValue: (res: Response) => Data
) => {
  return async (slug: string, { previewMode, ...params }: Params = {}) => {
    const response = await graphqlMethod({
      isDraftFilter: getDraftFilterParam(previewMode),
      slug,
      ...params,
    });

    /**
     * Casting to `Response` here because of a hairy TS problem with narrowing
     * of the `response` variable. Hovering `response` above will show
     * it could be any one of a union of GQLMethod, as I can't manage
     * to narrow the generic to be only the return of the provided `Method`.
     * No casting results in the following error
     *     'X' is assignable to the constraint of type 'Response', but 'Response'
     *     could be instantiated with a different subtype of constraint 'X | Y | Z...'
     * If you hover `(response) =>` in the call-site of `getResultValue` you'll see
     * that the correct type is inferred there
     *   - RM 28/11/22
     */
    const pageData = getResultValue(response as Response);

    if (!pageData) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(schema, withResolvedReferences, previewMode);
  };
};

export const getSingleton = <
  Method extends GQLMethod,
  Response extends Awaited<ReturnType<Method>>,
  Data extends Record<string, unknown> | undefined,
  Schema extends z.ZodTypeAny
>(
  graphqlMethod: Method,
  schema: Schema,
  getResultValue: (res: Response) => Data
) => {
  return async ({ previewMode, ...params }: Params = {}) => {
    const response = await graphqlMethod({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    // See comment explaining casting in `getBySlug` variant
    const pageData = getResultValue(response as Response);

    if (!pageData) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(schema, withResolvedReferences, previewMode);
  };
};

export const getList = <
  Method extends GQLMethod,
  Response extends Awaited<ReturnType<Method>>,
  Data extends Array<Record<string, unknown>>,
  Schema extends z.ZodTypeAny
>(
  graphqlMethod: Method,
  schema: Schema,
  getPageData: (res: Response) => Data
) => {
  return async ({ previewMode, ...params }: ListParams = {}) => {
    const response = await graphqlMethod({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    // See comment explaining casting in `getBySlug` variant
    const pageData = getPageData(response as Response);

    if (!pageData) {
      return [];
    }

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(schema, withResolvedReferences, previewMode);
  };
};

/**
 * Search for references to other documents or hubspot forms within
 * sanity documents and "resolve" them to their actual values
 */
export const resolveEmbeddedReferences = async <
  T extends Record<string, unknown> | Record<string, unknown>[]
>(
  document: T
): Promise<T> => {
  const withPortableTextReferences = await resolveSanityReferences(document);
  const withForms = await resolveHubspotFromReferences(
    withPortableTextReferences
  );

  return withForms;
};

/**
 * When in preview mode we want to fetch draft and non-draft
 * content and filter client side, but for production we
 * never want draft content.
 *
 * See sanity-graphql.md for more information on how/why the is_draft
 * param is passed to queries
 */
export const getDraftFilterParam = (
  isPreviewMode: boolean | undefined
): { is_draft: boolean | undefined } =>
  isPreviewMode ? { is_draft: undefined } : { is_draft: false };
