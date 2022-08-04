import { z } from "zod";

import { CMSClient } from "..";
import sanityGraphqlApi from "../../sanity-graphql";

import { webinarPreviewSchema, webinarSchema } from "./schemas";
import { planningPageSchema } from "./schemas/pages";

const getSanityClient: CMSClient = () => ({
  webinars: async (params) => {
    const webinarListSchema = z.array(webinarPreviewSchema);
    const webinarResults = await sanityGraphqlApi.allWebinars({ ...params });

    return webinarListSchema.parse(webinarResults.allWebinar);
  },
  webinarBySlug: async (slug, params) => {
    const webinarResult = await sanityGraphqlApi.webinarBySlug({
      ...params,
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
