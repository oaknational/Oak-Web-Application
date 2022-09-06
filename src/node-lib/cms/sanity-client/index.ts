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

    return webinarListSchema.parse(webinarResults.allWebinar);
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

    return webinarSchema.parse(webinar);
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

    return blogPostListSchema.parse(blogPostsResult.allNewsPost);
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

    return blogPostSchema.parse(blogWithResolvedRefs);
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

    return homePageSchema.parse(homepageData);
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

    return planningPageSchema.parse(planningPageData);
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
    return aboutWhoWeArePageSchema.parse(subPageData);
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
    return aboutLeadershipPageSchema.parse(data);
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
    return aboutBoardPageSchema.parse(data);
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
    return aboutPartnersPageSchema.parse(data);
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
    return aboutWorkWithUsPageSchema.parse(data);
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

    return curriculumPageSchema.parse(curriculumPageData);
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

    return policyPageListSchema.parse(policyPageResults.allPolicyPage);
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

    return policyPageSchema.parse(policyPage);
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

    return landingPageListSchema.parse(landingPageResults.allLandingPage);
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

    return landingPageSchema.parse(landingPage);
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
