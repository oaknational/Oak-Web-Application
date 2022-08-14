import { z } from "zod";

import { CMSClient } from "../types/client";
import sanityGraphqlApi from "../../sanity-graphql";

import { webinarPreviewSchema, webinarSchema } from "./schemas";
import {
  aboutPageSchema,
  planningPageSchema,
  curriculumPageSchema,
} from "./schemas/pages";

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
});

export default getSanityClient;
