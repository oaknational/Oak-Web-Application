import { z } from "zod";

import sanityGraphqlApi from "../../sanity-graphql";
import {
  aboutBoardPageSchema,
  aboutLeadershipPageSchema,
  aboutPartnersPageSchema,
  aboutWhoWeArePageSchema,
  aboutWorkWithUsPageSchema,
  homePageSchema,
  curriculumPageSchema,
  contactPageSchema,
  blogPostPreviewSchema,
  blogPostSchema,
  planningPageSchema,
  policyPagePreviewSchema,
  policyPageSchema,
  webinarPreviewSchema,
  webinarSchema,
  landingPagePreviewSchema,
  landingPageSchema,
  supportPageSchema,
} from "../../../common-lib/cms-types";
import { webinarsListingPageSchema } from "../../../common-lib/cms-types/webinarsListingPage";

import { resolveSanityReferences } from "./resolveSanityReferences";
import { parseResults } from "./parseResults";

export type Params = {
  previewMode?: boolean;
};

export type ListParams = Params & {
  limit?: number;
};

const resolveEmbeddedReferences = async <T extends Record<string, unknown>>(
  document: T
): Promise<T> => {
  const withPortableTextReferences = await resolveSanityReferences(document);
  return withPortableTextReferences;
};

const getSanityClient = () => ({
  webinarsListingPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.webinarsListingPage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const webinarsListingPageData = result?.allWebinarListingPage?.[0];

    if (!webinarsListingPageData) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(
      webinarsListingPageData
    );

    return parseResults(
      webinarsListingPageSchema,
      withResolvedReferences,
      previewMode
    );
  },

  webinars: async ({ previewMode, ...params }: ListParams = {}) => {
    const webinarListSchema = z.array(webinarPreviewSchema);
    const webinarResults = await sanityGraphqlApi.allWebinars({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    if (!webinarResults.allWebinar) {
      return [];
    }

    return parseResults(
      webinarListSchema,
      webinarResults.allWebinar,
      previewMode
    );
  },
  webinarBySlug: async (
    slug: string,
    { previewMode, ...params }: Params = {}
  ) => {
    const webinarResult = await sanityGraphqlApi.webinarBySlug({
      ...params,
      isDraftFilter: getDraftFilterParam(previewMode),
      slug,
    });
    const webinar = webinarResult?.allWebinar?.[0];

    if (!webinar) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(webinar);

    return parseResults(webinarSchema, withResolvedReferences, previewMode);
  },
  blogPosts: async ({ previewMode, ...params }: ListParams = {}) => {
    const blogPostListSchema = z.array(blogPostPreviewSchema);
    const blogPostsResult = await sanityGraphqlApi.allBlogPosts({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    if (!blogPostsResult.allNewsPost) {
      return [];
    }

    return parseResults(
      blogPostListSchema,
      blogPostsResult.allNewsPost,
      previewMode
    );
  },
  blogPostBySlug: async (
    slug: string,
    { previewMode, ...params }: Params = {}
  ) => {
    const blogPostResult = await sanityGraphqlApi.blogPostBySlug({
      ...params,
      isDraftFilter: getDraftFilterParam(previewMode),
      slug,
    });
    const blogPost = blogPostResult?.allNewsPost?.[0];

    if (!blogPost) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(blogPost);

    return parseResults(blogPostSchema, withResolvedReferences, previewMode);
  },
  homepage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.homepage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const homepageData = result?.allHomepage?.[0];

    if (!homepageData) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(
      homepageData
    );

    return parseResults(homePageSchema, withResolvedReferences, previewMode);
  },
  planningPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.planningCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const planningPageData = result?.allPlanningCorePage?.[0];

    if (!planningPageData) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(
      planningPageData
    );

    return parseResults(
      planningPageSchema,
      withResolvedReferences,
      previewMode
    );
  },
  aboutWhoWeArePage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.aboutWhoWeArePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const whoWeArePageData = result?.allAboutCorePageWhoWeAre?.[0];
    const parentPageData = result?.aboutCorePage?.[0];

    if (!whoWeArePageData) {
      return null;
    }

    const pageData = {
      ...parentPageData,
      ...whoWeArePageData,
    };

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(
      aboutWhoWeArePageSchema,
      withResolvedReferences,
      previewMode
    );
  },
  aboutLeadershipPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.aboutLeadershipPage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const leadershipPageData = result?.allAboutCorePageLeadership?.[0];
    const parentPageData = result?.aboutCorePage?.[0];

    if (!leadershipPageData) {
      return null;
    }

    const pageData = {
      ...parentPageData,
      ...leadershipPageData,
    };

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(
      aboutLeadershipPageSchema,
      withResolvedReferences,
      previewMode
    );
  },
  aboutBoardPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.aboutBoardPage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const boardPageData = result?.allAboutCorePageBoard?.[0];
    const parentPageData = result?.aboutCorePage?.[0];

    if (!boardPageData) {
      return null;
    }

    const pageData = {
      ...parentPageData,
      ...boardPageData,
    };

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(
      aboutBoardPageSchema,
      withResolvedReferences,
      previewMode
    );
  },
  aboutPartnersPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.aboutPartnersPage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const partnersPageData = result?.allAboutCorePagePartners?.[0];
    const parentPageData = result?.aboutCorePage?.[0];

    if (!partnersPageData) {
      return null;
    }

    const pageData = {
      ...parentPageData,
      ...partnersPageData,
    };

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(
      aboutPartnersPageSchema,
      withResolvedReferences,
      previewMode
    );
  },
  aboutWorkWithUsPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.aboutWorkWithUsPage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const workWithUsPage = result?.allAboutCorePageWorkWithUs?.[0];
    const parentPageData = result?.aboutCorePage?.[0];

    if (!workWithUsPage) {
      return null;
    }

    const pageData = {
      ...parentPageData,
      ...workWithUsPage,
    };

    const withResolvedReferences = await resolveEmbeddedReferences(pageData);

    return parseResults(
      aboutWorkWithUsPageSchema,
      withResolvedReferences,
      previewMode
    );
  },
  curriculumPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.curriculumCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const curriculumPageData = result?.allCurriculumCorePage?.[0];

    if (!curriculumPageData) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(
      curriculumPageData
    );
    return parseResults(
      curriculumPageSchema,
      withResolvedReferences,
      previewMode
    );
  },
  supportPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.supportCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const supportPageData = result?.allSupportCorePage?.[0];

    if (!supportPageData) {
      return null;
    }

    return parseResults(supportPageSchema, supportPageData, previewMode);
  },
  contactPage: async ({ previewMode, ...params }: Params = {}) => {
    const result = await sanityGraphqlApi.contactCorePage({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });
    const contactPageData = result?.allContactCorePage?.[0];

    if (!contactPageData) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(
      contactPageData
    );

    return parseResults(contactPageSchema, withResolvedReferences, previewMode);
  },
  policyPages: async ({ previewMode, ...params }: ListParams = {}) => {
    const policyPageListSchema = z.array(policyPagePreviewSchema);
    const policyPageResults = await sanityGraphqlApi.allPolicyPages({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    if (!policyPageResults.allPolicyPage) {
      return [];
    }

    return parseResults(
      policyPageListSchema,
      policyPageResults.allPolicyPage,
      previewMode
    );
  },
  policyPageBySlug: async (
    slug: string,
    { previewMode, ...params }: Params = {}
  ) => {
    const policyPageResult = await sanityGraphqlApi.policyPageBySlug({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
      slug,
    });

    const policyPage = policyPageResult?.allPolicyPage?.[0];
    if (!policyPage) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(policyPage);

    return parseResults(policyPageSchema, withResolvedReferences, previewMode);
  },
  landingPages: async ({ previewMode, ...params }: ListParams = {}) => {
    const landingPageListSchema = z.array(landingPagePreviewSchema);
    const landingPageResults = await sanityGraphqlApi.allLandingPages({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
    });

    if (!landingPageResults.allLandingPage) {
      return [];
    }

    return parseResults(
      landingPageListSchema,
      landingPageResults.allLandingPage,
      previewMode
    );
  },
  landingPageBySlug: async (
    slug: string,
    { previewMode, ...params }: Params = {}
  ) => {
    const landingPageResult = await sanityGraphqlApi.landingPageBySlug({
      isDraftFilter: getDraftFilterParam(previewMode),
      ...params,
      slug,
    });
    const landingPage = landingPageResult?.allLandingPage?.[0];

    if (!landingPage) {
      return null;
    }

    const withResolvedReferences = await resolveEmbeddedReferences(landingPage);

    return parseResults(landingPageSchema, withResolvedReferences, previewMode);
  },
});

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
