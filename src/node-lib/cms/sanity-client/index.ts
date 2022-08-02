import { z } from "zod";

import { CMSClient } from "..";
import sanityGraphqlApi from "../../sanity-graphql";

import { webinarPreviewSchema, webinarSchema } from "./schemas";
import { planningPageSchema } from "./schemas/pages";

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
  planningPage: async (params?) => {
    const result = await sanityGraphqlApi.planningCorePage(params);
    const planningPageData = result.allPlanningCorePage[0];

    return planningPageSchema.parse(planningPageData);
  },
});

export default getSanityClient;
