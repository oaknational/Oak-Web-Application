import { z } from "zod";

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
import { parseResults } from "./parseResults";

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

    return parseResults(
      webinarListSchema,
      webinarResults.allWebinar,
      previewMode
    );
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

    return parseResults(webinarSchema, webinar, previewMode);
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

    return parseResults(
      blogPostListSchema,
      blogPostsResult.allNewsPost,
      previewMode
    );
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

    return parseResults(blogPostSchema, blogWithResolvedRefs, previewMode);
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

    return parseResults(homePageSchema, homepageData, previewMode);
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

    return parseResults(planningPageSchema, planningPageData, previewMode);
  },
  aboutWhoWeArePage: async ({ previewMode, ...params } = {}) => {
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
    return parseResults(aboutWhoWeArePageSchema, pageData, previewMode);
  },
  aboutLeadershipPage: async ({ previewMode, ...params } = {}) => {
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
    return parseResults(aboutLeadershipPageSchema, pageData, previewMode);
  },
  aboutBoardPage: async ({ previewMode, ...params } = {}) => {
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
    return parseResults(aboutBoardPageSchema, pageData, previewMode);
  },
  aboutPartnersPage: async ({ previewMode, ...params } = {}) => {
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
    return parseResults(aboutPartnersPageSchema, pageData, previewMode);
  },
  aboutWorkWithUsPage: async ({ previewMode, ...params } = {}) => {
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
    return parseResults(aboutWorkWithUsPageSchema, pageData, previewMode);
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

    return parseResults(curriculumPageSchema, curriculumPageData, previewMode);
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

    return parseResults(
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

    return parseResults(policyPageSchema, policyPage, previewMode);
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

    return parseResults(
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

    const landingPageResolvedRef = await resolveReferences(landingPage);

    return parseResults(landingPageSchema, landingPageResolvedRef, previewMode);
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
