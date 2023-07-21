import { z } from "zod";

import sdk from "./sdk";
import lessonOverviewQuery from "./queries/lessonOverview/lessonOverview.query";
import lessonListingQuery from "./queries/lessonListing/lessonListing.query";
import subjectListingQuery from "./queries/subjectListing/subjectListing.query";
import lessonDownloadsQuery from "./queries/downloads/downloads.query";
import programmeListingQuery from "./queries/programmeListing/programmeListing.query";
import unitListingQuery from "./queries/unitListing/unitListing.query";
import curriculumSubjectPhaseQuery from "./queries/curriculumSubjectPhase/curriculumSubjectPhase.query";

const keyStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortCode: z.string(),
  displayOrder: z.number().optional(),
});

const teachersHomePageData = z.object({
  keyStages: z.array(keyStageSchema),
});

const subjectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number(),
});
const phaseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number(),
});
const contentTypesSchema = z.object({
  slug: z.union([z.literal("unit"), z.literal("lesson")]),
  title: z.union([z.literal("Units"), z.literal("Lessons")]),
});

const searchPageSchema = z.object({
  keyStages: z.array(keyStageSchema),
  subjects: z.array(subjectSchema),
  contentTypes: z.array(contentTypesSchema),
});

// const SubjectPhaseOptionsSchema = z.object({
//   newSubjects: z.array(subjectSchema),
//   legacySubjects: z.array(subjectSchema),
//   phases: z.array(phaseSchema),
// })

export type Phase = z.infer<typeof phaseSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type SearchPageData = z.infer<typeof searchPageSchema>;
export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;
// export type SubjectPhaseOptions = z.infer<typeof SubjectPhaseOptionsSchema>;

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
    const teachersHomePage = getFirstResultOrNull()({
      results: res.teachersHomePage,
    });
    return teachersHomePageData.parse(teachersHomePage);
  },
  lessonListing: lessonListingQuery(sdk),
  lessonDownloads: lessonDownloadsQuery(sdk),
  unitListing: unitListingQuery(sdk),
  searchPage: async () => {
    const res = await sdk.searchPage();
    const searchPage = getFirstResultOrNull()({ results: res.searchPage });
    return searchPageSchema.parse(searchPage);
  },
  subjectListingPage: subjectListingQuery(sdk),
  programmeListingPage: programmeListingQuery(sdk),
  lessonOverview: lessonOverviewQuery(sdk),
  curriculumSubjectPhase: curriculumSubjectPhaseQuery(sdk),
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
