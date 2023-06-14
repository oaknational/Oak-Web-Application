import { GraphQLClient } from "graphql-request";
import { z } from "zod";

import config from "../../config/server";

import { getSdk } from "./generated/sdk";

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
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
