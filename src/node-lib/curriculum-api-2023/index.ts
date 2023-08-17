import { z } from "zod";

import sdk from "./sdk";
import lessonOverviewQuery from "./queries/lessonOverview/lessonOverview.query";
import lessonListingQuery from "./queries/lessonListing/lessonListing.query";
import subjectListingQuery from "./queries/subjectListing/subjectListing.query";
import lessonDownloadsQuery from "./queries/downloads/downloads.query";
import programmeListingQuery from "./queries/programmeListing/programmeListing.query";
import unitListingQuery from "./queries/unitListing/unitListing.query";
import subjectPhaseOptionsQuery from "./queries/subjectPhaseOptions/subjectPhaseOptions.query";
import curriculumOverviewQuery from "./queries/curriculumOverview/curriculumOverview.query";
import curriculumUnitsQuery from "./queries/curriculumUnits/curriculumUnits.query";
import curriculumDownloadsQuery from "./queries/curriculumDownloads/curriculumDownloads.query";

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
  displayOrder: z.number().optional(),
});
const phaseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
});
const examboardSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
});
const unitSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
});
const threadSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
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
const subjectPhaseOptionSchema = subjectSchema.extend({
  phases: z.array(phaseSchema),
  examboards: z.array(examboardSchema).optional().nullable(),
});

const curriculumOverviewTabData = z.object({
  subjectPrinciples: z.array(z.string()),
  curriculaDesc: z.string(),
  partnerBio: z.string(),
  videoGuideDesc: z.string(),
});

const curriculumUnitsTabData = z.object({
  units: z.array(unitSchema),
  threads: z.array(threadSchema),
});

const curriculumDownloadsTabData = z.object({
  urls: z.array(z.string()),
});

export type Phase = z.infer<typeof phaseSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type Examboard = z.infer<typeof examboardSchema>;
export type SubjectPhaseOption = z.infer<typeof subjectPhaseOptionSchema>;
export type SearchPageData = z.infer<typeof searchPageSchema>;
export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;
export type CurriculumOverviewTabData = z.infer<
  typeof curriculumOverviewTabData
>;
export type CurriculumUnitsTabData = z.infer<typeof curriculumUnitsTabData>;
export type CurriculumDownloadsTabData = z.infer<
  typeof curriculumDownloadsTabData
>;

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
  subjectPhaseOptions: subjectPhaseOptionsQuery(sdk),
  curriculumOverview: curriculumOverviewQuery(sdk),
  curriculumUnits: curriculumUnitsQuery(sdk),
  curriculumDownloads: curriculumDownloadsQuery(sdk),
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
