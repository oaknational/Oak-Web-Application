import { z } from "zod";

import { CMSClient } from "..";
import sanityGraphqlApi from "../../sanity-graphql";

import { webinarPreviewSchema, webinarSchema } from "./schemas";

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
});

export default getSanityClient;
