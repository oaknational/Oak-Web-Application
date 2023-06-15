import { GraphQLClient } from "graphql-request";
import { z } from "zod";

import config from "../../config/server";

import { getSdk } from "./generated/sdk";
import OakError from "../../errors/OakError";
import errorReporter from "../../common-lib/error-reporter/errorReporter";
import lessonListingSchema from "./schema/lessonListing.schema";

const curriculumApiUrl = config.get("curriculumApi2023Url");
const curriculumApiAuthType = config.get("curriculumApiAuthType");
const curriculumApiAuthKey = config.get("curriculumApi2023AuthKey");

/**
 * TS complaining when Headers in not typed.
 */
type Headers = { "x-oak-auth-type": string; "x-oak-auth-key": string };
const headers: Headers = {
  "x-oak-auth-type": curriculumApiAuthType,
  "x-oak-auth-key": curriculumApiAuthKey,
};
const graphqlClient = new GraphQLClient(curriculumApiUrl, { headers });
const sdk = getSdk(graphqlClient);

const keyStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortCode: z.string(),
});

const teachersHomePageData = z.object({
  keyStages: z.array(keyStageSchema),
});

export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;

const curriculumApi2023 = {
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();

    return teachersHomePageData.parse(res);
  },
  lessonListing: async (args: { programmeSlug: string; unitSlug: string }) => {
    const res = await sdk.lessonListing(args);

    const [unit] = res.unit;

    if (!unit) {
      throw new OakError({ code: "curriculum-api/not-found" });
    }

    if (res.unit.length > 1) {
      const error = new OakError({
        code: "curriculum-api/uniqueness-assumption-violated",
      });
      errorReporter("curriculum-api-2023::lessonListing")(error, {
        severity: "warning",
        ...args,
        res,
      });
    }

    return lessonListingSchema.parse(unit);
  },
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
