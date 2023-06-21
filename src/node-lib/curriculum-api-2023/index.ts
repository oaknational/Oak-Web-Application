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
  displayOrder: z.number().optional(),
});

const teachersHomePageData = z.object({
  keyStages: z.array(keyStageSchema),
});

const subjectSchema = z.array(
  z.object({
    title: z.string(),
    slug: z.string(),
    displayOrder: z.number(),
  })
);
const contentTypesSchema = z.object({
  slug: z.union([z.literal("unit"), z.literal("lesson")]),
  title: z.union([z.literal("Units"), z.literal("Lessons")]),
});

const searchPageSchema = z.object({
  keyStages: z.array(keyStageSchema),
  subjects: subjectSchema,
  contentTypes: z.array(contentTypesSchema),
});

export type SearchPageData = z.infer<typeof searchPageSchema>;
export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;

export const getFirstResultOrNull =
  () =>
  <T>({ results }: { results: T[] }) => {
    const [firstResult] = results;
    if (!firstResult) {
      return null;
    }

    return firstResult;
  };

const curriculumApi2023 = {
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();

    return teachersHomePageData.parse(res);
  },
  searchPage: async () => {
    const res = await sdk.searchPage();
    const searchPage = getFirstResultOrNull()({ results: res.searchPage });
    console.log(searchPage);
    return searchPageSchema.parse(searchPage);
  },
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
