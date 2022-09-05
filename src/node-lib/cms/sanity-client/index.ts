import { z } from "zod";

import { CMSClient } from "../types/client";
import sanityGraphqlApi from "../../sanity-graphql";

import {
  aboutPageSchema,
  planningPageSchema,
  curriculumPageSchema,
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
      isDraft: previewMode === true,
      ...params,
    });

    return webinarListSchema.parse(webinarResults.allWebinar);
  },
  webinarBySlug: async (slug, { previewMode, ...params } = {}) => {
    const webinarResult = await sanityGraphqlApi.webinarBySlug({
      ...params,
      isDraft: previewMode === true,
      slug,
    });
    const webinar = webinarResult.allWebinar[0];

    return webinarSchema.parse(webinar);
  },
  blogPosts: async ({ previewMode, ...params } = {}) => {
    const blogPostListSchema = z.array(blogPostPreviewSchema);
    const blogPostsResult = await sanityGraphqlApi.allBlogPosts({
      isDraft: previewMode === true,
      ...params,
    });

    return blogPostListSchema.parse(blogPostsResult.allNewsPost);
  },
  blogPostBySlug: async (slug, { previewMode, ...params } = {}) => {
    const blogPostResult = await sanityGraphqlApi.blogPostBySlug({
      ...params,
      isDraft: previewMode === true,
      slug,
    });
    const blogPost = blogPostResult.allNewsPost[0];

    const contentWithReferences = blogPost?.contentPortableText
      ? await resolveReferences(blogPost.contentPortableText)
      : [];

    const blogWithResolvedRefs = {
      ...blogPost,
      contentPortableText: contentWithReferences,
    };

    return blogPostSchema.parse(blogWithResolvedRefs);
  },
  planningPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.planningCorePage({
      isDraft: previewMode === true,
      ...params,
    });
    const planningPageData = result.allPlanningCorePage[0];

    return planningPageSchema.parse(planningPageData);
  },
  aboutPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.aboutCorePage({
      isDraft: previewMode === true,
      ...params,
    });
    const planningPageData = result.allAboutCorePage[0];

    return aboutPageSchema.parse(planningPageData);
  },
  curriculumPage: async ({ previewMode, ...params } = {}) => {
    const result = await sanityGraphqlApi.curriculumCorePage({
      isDraft: previewMode === true,
      ...params,
    });
    const curriculumPageData = result.allCurriculumCorePage[0];

    return curriculumPageSchema.parse(curriculumPageData);
  },
  policyPages: async ({ previewMode, ...params } = {}) => {
    const policyPageListSchema = z.array(policyPagePreviewSchema);
    const policyPageResults = await sanityGraphqlApi.allPolicyPages({
      isDraft: previewMode === true,
      ...params,
    });

    return policyPageListSchema.parse(policyPageResults.allPolicyPage);
  },
  policyPageBySlug: async (slug, { previewMode, ...params } = {}) => {
    const policyPageResult = await sanityGraphqlApi.policyPageBySlug({
      isDraft: previewMode === true,
      ...params,
      slug,
    });
    const webinar = policyPageResult.allPolicyPage[0];

    return policyPageSchema.parse(webinar);
  },
  landingPages: async ({ previewMode, ...params } = {}) => {
    const landingPageListSchema = z.array(landingPagePreviewSchema);
    const landingPageResults = await sanityGraphqlApi.allLandingPages({
      isDraft: previewMode === true,
      ...params,
    });

    return landingPageListSchema.parse(landingPageResults.allLandingPage);
  },
  landingPageBySlug: async (slug, { previewMode, ...params } = {}) => {
    const landingPageResult = await sanityGraphqlApi.landingPageBySlug({
      isDraft: previewMode === true,
      ...params,
      slug,
    });
    const landingPage = landingPageResult.allLandingPage[0];

    return landingPageSchema.parse(landingPage);
  },
});

export default getSanityClient;
