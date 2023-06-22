import { z } from "zod";

import sdk from "./sdk";
import lessonListingQuery from "./queries/lessonListing/lessonListing.query";

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
  lessonListing: lessonListingQuery(sdk),
  searchPage: async () => {
    const res = await sdk.searchPage();
    const searchPage = getFirstResultOrNull()({ results: res.searchPage });
    return searchPageSchema.parse(searchPage);
  },
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
