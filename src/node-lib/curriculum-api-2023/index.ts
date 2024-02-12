import { z } from "zod";

import sdk from "./sdk";
import lessonOverviewQuery from "./queries/lessonOverview/lessonOverview.query";
import { pupilLessonOverviewQuery } from "./queries/pupilLessonOverview/pupilLessonOverview.query";
import lessonListingQuery from "./queries/lessonListing/lessonListing.query";
import subjectListingQuery from "./queries/subjectListing/subjectListing.query";
import lessonDownloadsQuery from "./queries/lessonDownloads/lessonDownloads.query";
import programmeListingQuery from "./queries/programmeListing/programmeListing.query";
import unitListingQuery from "./queries/unitListing/unitListing.query";
import subjectPhaseOptionsQuery from "./queries/subjectPhaseOptions/subjectPhaseOptions.query";
import curriculumOverviewQuery from "./queries/curriculumOverview/curriculumOverview.query";
import curriculumHeaderQuery from "./queries/curriculumHeader/curriculumHeader.query";
import curriculumDownloadsQuery from "./queries/curriculumDownloads/curriculumDownloads.query";
import curriculumUnitsQuery from "./queries/curriculumUnits/curriculumUnits.query";
import curriculumUnitsSchema from "./queries/curriculumUnits/curriculumUnits.schema";
import lessonOverviewCanonicalQuery from "./queries/lessonOverviewCanonical/lessonOverviewCanonical.query";
import lessonDownloadsCanonicalQuery from "./queries/lessonDownloadsCanonical/lessonDownloadsCanonical.query";
import curriculumOverviewSchema from "./queries/curriculumOverview/curriculumOverview.schema";
import searchPageQuery from "./queries/searchPage/searchPage.query";
import lessonShareQuery from "./queries/lessonShare/lessonShare.query";

export const keyStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortCode: z.string(),
  displayOrder: z.number().optional(),
});

const teachersHomePageData = z.object({
  keyStages: z.array(keyStageSchema),
});

export const subjectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
});
const phaseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
});
export const examboardSchema = z.object({
  title: z.string(),
  slug: z.string(),
  displayOrder: z.number().optional(),
});

const contentTypesSchema = z.object({
  slug: z.union([z.literal("unit"), z.literal("lesson")]),
  title: z.union([z.literal("Units"), z.literal("Lessons")]),
});

export const searchPageSchema = z.object({
  keyStages: z.array(keyStageSchema),
  subjects: z.array(subjectSchema),
  contentTypes: z.array(contentTypesSchema),
  examBoards: z.array(examboardSchema),
});

export const subjectPhaseOptionSchema = subjectSchema.extend({
  phases: z.array(phaseSchema),
  examboards: z.array(examboardSchema).optional().nullable(),
});

const curriculumHeaderData = z.object({
  subject: z.string(),
  subjectSlug: z.string(),
  phase: z.string(),
  phaseSlug: z.string(),
  examboard: z.string().optional(),
  examboardSlug: z.string().optional(),
});

const curriculumDownloadsTabData = z.object({
  urls: z.array(z.string()),
});

export type Phase = z.infer<typeof phaseSchema>;
export type Subject = z.infer<typeof subjectSchema>;
export type Examboard = z.infer<typeof examboardSchema>;
export type SubjectPhaseOption = z.infer<typeof subjectPhaseOptionSchema>;
export type TeachersHomePageData = z.infer<typeof teachersHomePageData>;
export type CurriculumOverviewMVData = z.infer<typeof curriculumOverviewSchema>;
export type SearchPageData = z.infer<typeof searchPageSchema>;

export type CurriculumDownloadsTabData = z.infer<
  typeof curriculumDownloadsTabData
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
  curriculumOverview: curriculumOverviewQuery(sdk),
  curriculumUnits: curriculumUnitsQuery(sdk),
  curriculumDownloads: curriculumDownloadsQuery(),
  curriculumHeader: curriculumHeaderQuery(sdk),
  lessonListing: lessonListingQuery(sdk),
  lessonDownloads: lessonDownloadsQuery(sdk),
  lessonShare: lessonShareQuery(sdk),
  lessonDownloadsCanonical: lessonDownloadsCanonicalQuery(sdk),
  lessonOverview: lessonOverviewQuery(sdk),
  pupilLessonOverview: pupilLessonOverviewQuery(sdk),
  lessonOverviewCanonical: lessonOverviewCanonicalQuery(sdk),
  programmeListingPage: programmeListingQuery(sdk),
  searchPage: searchPageQuery(sdk),
  subjectListingPage: subjectListingQuery(sdk),
  subjectPhaseOptions: subjectPhaseOptionsQuery(sdk),
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();
    const teachersHomePage = getFirstResultOrNull()({
      results: res.teachersHomePage,
    });
    return teachersHomePageData.parse(teachersHomePage);
  },
  unitListing: unitListingQuery(sdk),
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
