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
import curriculumHeaderQuery from "./queries/curriculumHeader/curriculumHeader.query";
import curriculumDownloadsQuery from "./queries/curriculumDownloads/curriculumDownloads.query";
import curriculumUnitsQuery from "./queries/curriculumUnits/curriculumUnits.query";
import curriculumUnitsSchema from "./queries/curriculumUnits/curriculumUnits.schema";

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
const contentTypesSchema = z.object({
  slug: z.union([z.literal("unit"), z.literal("lesson")]),
  title: z.union([z.literal("Units"), z.literal("Lessons")]),
});
const searchPageSchema = z.object({
  keyStages: z.array(keyStageSchema),
  subjects: z.array(subjectSchema),
  contentTypes: z.array(contentTypesSchema),
});

export const subjectPhaseOptionSchema = subjectSchema.extend({
  phases: z.array(phaseSchema),
  examboards: z.array(examboardSchema).optional().nullable(),
});

const curriculumHeaderData = z.object({
  subject: subjectSchema,
  phase: phaseSchema,
  examBoard: examboardSchema,
});

const curriculumOverviewTabData = z.object({
  subjectPrinciples: z.array(z.string()),
  curriculaDesc: z.string(),
  partnerBio: z.string(),
  videoGuideDesc: z.string(),
  subjectSlug: z.string(),
});

const curriculumDownloadTabData = z.object({
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
export type CurriculumDownloadTabData = z.infer<
  typeof curriculumDownloadTabData
>;
export type CurriculumHeaderData = z.infer<typeof curriculumHeaderData>;

export type CurriculumUnitsTabData = z.infer<typeof curriculumUnitsSchema>;
export type CurriculumUnit = z.infer<
  typeof curriculumUnitsSchema
>["units"][number];

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
  curriculumHeader: curriculumHeaderQuery(sdk),
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
