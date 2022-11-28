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
    const result = await graphqlMethod({
      isDraftFilter: getDraftFilterParam(previewMode),
      slug,
      ...params,
    });

    const pageData = getResultValue(result);

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
    const result = await graphqlMethod({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    const pageData = getResultValue(result);

    if (!pageData) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(schema, withResolvedReferences, previewMode);
  };
};

export const getList = <
  Method extends GQLMethod,
  Resp extends Awaited<ReturnType<Method>>,
  Data extends Array<Record<string, unknown>>,
  Schema extends z.ZodTypeAny
>(
  graphqlMethod: Method,
  schema: Schema,
  getPageData: (res: Resp) => Data
) => {
  return async ({ previewMode, ...params }: ListParams = {}) => {
    const results = await graphqlMethod({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    const pageData = getPageData(results);

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
 * never want draft content
 */
export const getDraftFilterParam = (
  isPreviewMode: boolean | undefined
): { is_draft: boolean | undefined } =>
  isPreviewMode ? { is_draft: undefined } : { is_draft: false };
