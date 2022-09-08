import { z, ZodArray, ZodSchema, ZodTypeAny } from "zod";

import { CMSClient } from "../types/client";
import sanityGraphqlApi from "../../sanity-graphql";

import {
  planningPageSchema,
  curriculumPageSchema,
  homePageSchema,
  aboutBoardPageSchema,
  aboutLeadershipPageSchema,
  aboutPartnersPageSchema,
  aboutWhoWeArePageSchema,
  aboutWorkWithUsPageSchema,
} from "./schemas/pages";
import {
  blogPostPreviewSchema,
  blogPostSchema,
  policyPagePreviewSchema,
  policyPageSchema,
  webinarPreviewSchema,
  webinarSchema,
} from "./schemas";
import { resolveReferences } from "./resolveReferences";
import {
  landingPagePreviewSchema,
  landingPageSchema,
} from "./schemas/landingPage";

const getSanityClient: CMSClient = () => ({
  webinars: async ({ previewMode, ...params } = {}) => {
    const webinarListSchema = z.array(webinarPreviewSchema);
    const webinarResults = await sanityGraphqlApi.allWebinars({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    if (!webinarResults.allWebinar) {
      return [];
    }

    return parse(webinarListSchema, webinarResults.allWebinar, previewMode);
  },
  webinarBySlug: async (slug, { previewMode, ...params } = {}) => {
    const webinarResult = await sanityGraphqlApi.webinarBySlug({
      ...params,
      isDraftFilter: getDraftFilterParam(previewMode),
      slug,
    });
    const webinar = webinarResult?.allWebinar?.[0];

    if (!webinar) {
      return null;
    }

    return parse(webinarSchema, webinar, previewMode);
  },
  blogPosts: async ({ previewMode, ...params } = {}) => {
    const blogPostListSchema = z.array(blogPostPreviewSchema);
    const blogPostsResult = await sanityGraphqlApi.allBlogPosts({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    if (!blogPostsResult.allNewsPost) {
      return [];
    }

    return parse(blogPostListSchema, blogPostsResult.allNewsPost, previewMode);
  },
  blogPostBySlug: async (slug, { previewMode, ...params } = {}) => {
    const blogPostResult = await sanityGraphqlApi.blogPostBySlug({
      ...params,
      isDraftFilter: getDraftFilterParam(previewMode),
      slug,
    });
    const blogPost = blogPostResult?.allNewsPost?.[0];

    if (!blogPost) {
      return null;
    }

    const contentWithReferences = blogPost?.contentPortableText
      ? await resolveReferences(blogPost.contentPortableText)
      : [];

    const blogWithResolvedRefs = {
      ...blogPost,
      contentPortableText: contentWithReferences,
    };

    return parse(blogPostSchema, blogWithResolvedRefs, previewMode);
  },
  homepage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.homepage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const homepageData = result?.allHomepage?.[0];

    if (!homepageData) {
      return null;
    }

    return parse(homePageSchema, homepageData);
  },
  planningPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.planningCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const planningPageData = result?.allPlanningCorePage?.[0];

    if (!planningPageData) {
      return null;
    }

    return parse(planningPageSchema, planningPageData, previewMode);
  },
  aboutWhoWeArePage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.aboutCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const aboutPageData = result?.allAboutCorePage?.[0];

    if (!aboutPageData) {
      return null;
    }

    const subPageData = {
      ...aboutPageData,
      ...aboutPageData.whoWeAre,
    };
    return parse(aboutWhoWeArePageSchema, subPageData);
  },
  aboutLeadershipPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.aboutCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const aboutPageData = result?.allAboutCorePage?.[0];

    if (!aboutPageData) {
      return null;
    }

    const data = {
      ...aboutPageData,
      ...aboutPageData.leadership,
    };
    return parse(aboutLeadershipPageSchema, data, previewMode);
  },
  aboutBoardPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.aboutCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const aboutPageData = result?.allAboutCorePage?.[0];

    if (!aboutPageData) {
      return null;
    }

    const data = {
      ...aboutPageData,
      ...aboutPageData.board,
    };
    return parse(aboutBoardPageSchema, data, previewMode);
  },
  aboutPartnersPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.aboutCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const aboutPageData = result?.allAboutCorePage?.[0];

    if (!aboutPageData) {
      return null;
    }

    const data = {
      ...aboutPageData,
      ...aboutPageData.partners,
    };
    return parse(aboutPartnersPageSchema, data, previewMode);
  },
  aboutWorkWithUsPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.aboutCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const aboutPageData = result?.allAboutCorePage?.[0];

    if (!aboutPageData) {
      return null;
    }

    const data = {
      ...aboutPageData,
      ...aboutPageData.workWithUs,
    };
    return parse(aboutWorkWithUsPageSchema, data, previewMode);
  },
  curriculumPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.curriculumCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const curriculumPageData = result?.allCurriculumCorePage?.[0];

    if (!curriculumPageData) {
      return null;
    }

    return parse(curriculumPageSchema, curriculumPageData, previewMode);
  },
  policyPages: async ({ previewMode, ...params } = {}) => {
    const policyPageListSchema = z.array(policyPagePreviewSchema);
    const policyPageResults = await sanityGraphqlApi.allPolicyPages({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    if (!policyPageResults.allPolicyPage) {
      return [];
    }

    return parse(
      policyPageListSchema,
      policyPageResults.allPolicyPage,
      previewMode
    );
  },
  policyPageBySlug: async (slug, { previewMode, ...params } = {}) => {
    const policyPageResult = await sanityGraphqlApi.policyPageBySlug({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
      slug,
    });

    if (!policyPageResult?.allPolicyPage?.[0]) {
      return null;
    }

    const policyPage = await resolveReferences(
      policyPageResult.allPolicyPage[0]
    );

    return parse(policyPageSchema, policyPage, previewMode);
  },
  landingPages: async ({ previewMode, ...params } = {}) => {
    const landingPageListSchema = z.array(landingPagePreviewSchema);
    const landingPageResults = await sanityGraphqlApi.allLandingPages({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    if (!landingPageResults.allLandingPage) {
      return [];
    }

    return parse(
      landingPageListSchema,
      landingPageResults.allLandingPage,
      previewMode
    );
  },
  landingPageBySlug: async (slug, { previewMode, ...params } = {}) => {
    const landingPageResult = await sanityGraphqlApi.landingPageBySlug({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
      slug,
    });
    const landingPage = landingPageResult?.allLandingPage?.[0];

    if (!landingPage) {
      return null;
    }

    return parse(landingPageSchema, landingPage, previewMode);
  },
});

type WrapValue = {
  <D, T extends Array<D>>(item: T): T;
  <T>(item: T): T[];
};

const wrapValue: WrapValue = (item: unknown) =>
  Array.isArray(item) ? item : [item];

export function createInvalidRejectingSchema<E, S extends ZodArray<E, "many">>(
  arraySchema: S
) {
  const validate = (item: unknown) =>
    arraySchema.element.safeParse(item).success;
  return z.preprocess((val) => wrapValue(val).filter(validate), arraySchema);
}

const isZodArraySchema = <T extends ZodTypeAny>(
  schema: unknown
): schema is ZodArray<T> => {
  return "element" in schema;
};

/**
 * Filters a list to only unique items
 * - calls getProp on each item to get the value to compare
 * - when 2 items clash (getProp returns the same for both) onConflict
 *   is invoked. If it returns the previously seen value it's left at
 *   it's current index, otherwise the current/new value will be appended to acc
 *
 * @example
 *   uniqBy(
 *     [{ id: 1 }, { id: 2, keepMe: true }, { id: 3 }, { id: 2 }],
 *     (x) => x.id,
 *     (prev, current) =>
 *       current.keepMe ? current : prev.keepMe ? prev : current
 *   )
 *   // -> [{ id: 1 }, { id: 2, keepMe: true }, { id: 3 }]
 */
export const uniqBy = <T>(
  data: T[],
  getProp: (el: T) => unknown,
  onConflict: (prev: T, current: T) => T
): T[] => {
  return data.reduce<T[]>((acc, item) => {
    const alreadyExistsIdx = acc.findIndex(
      (el) => getProp(el) === getProp(item)
    );
    const alreadyExists = alreadyExistsIdx >= 0;
    const prevItem = acc[alreadyExistsIdx];

    if (alreadyExists && prevItem) {
      const itemToKeep = onConflict(prevItem, item);
      const keepPrev = itemToKeep === prevItem;

      if (keepPrev) {
        return acc;
      } else {
        const withoutPrevious = acc.filter((_, i) => i !== alreadyExistsIdx);
        return [...withoutPrevious, itemToKeep];
      }
    } else {
      return [...acc, item];
    }
  }, []);
};

const draftPrefixRegex = /^drafts\./;
const isDraft = (id: string): boolean => draftPrefixRegex.test(id);
const trimDraftsPrefix = (id: string) => id.replace(draftPrefixRegex, "");

export const parse = <S extends ZodSchema, D>(
  schema: S,
  data: D,
  isPreviewMode?: boolean
): ReturnType<typeof schema["parse"]> => {
  if (isPreviewMode) {
    if (isZodArraySchema(schema)) {
      const invalidRejectingSchema = createInvalidRejectingSchema(schema);
      const parsedItems = invalidRejectingSchema.parse(data);

      /**
       * Filter out any duplicates, rejecting the non-draft version
       * when a draft with a matching ID exists
       */
      const uniqueItems = uniqBy(
        parsedItems,
        (x) => trimDraftsPrefix(x.id),
        (prev, current) => (isDraft(prev.id) ? prev : current)
      );

      return uniqueItems;
    } else {
      return schema.parse(data);
    }
  }

  return schema.parse(data);
};

/**
 * When in preview mode we want to fetch draft and non-draft
 * content and filter client side, but for production we
 * never want draft content
 */
const getDraftFilterParam = (
  isPreviewMode: boolean | undefined
): { is_draft: boolean | undefined } =>
  isPreviewMode ? { is_draft: undefined } : { is_draft: false };

export default getSanityClient;
