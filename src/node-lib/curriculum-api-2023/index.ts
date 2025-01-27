import { z } from "zod";

import sdk from "./sdk";
import lessonOverviewQuery from "./queries/lessonOverview/lessonOverview.query";
import lessonListingQuery from "./queries/lessonListing/lessonListing.query";
import subjectListingQuery from "./queries/subjectListing/subjectListing.query";
import lessonDownloadsQuery from "./queries/lessonDownloads/lessonDownloads.query";
import programmeListingQuery from "./queries/programmeListing/programmeListing.query";
import unitListingQuery from "./queries/unitListing/unitListing.query";
import curriculumOverviewQuery from "./queries/curriculumOverview/curriculumOverview.query";
import curriculumHeaderQuery from "./queries/curriculumHeader/curriculumHeader.query";
import curriculumDownloadsQuery from "./queries/curriculumDownloads/curriculumDownloads.query";
import curriculumUnitsQuery from "./queries/curriculumUnits/curriculumUnits.query";
import curriculumUnitsSchema from "./queries/curriculumUnits/curriculumUnits.schema";
import curriculumOverviewSchema from "./queries/curriculumOverview/curriculumOverview.schema";
import searchPageQuery from "./queries/searchPage/searchPage.query";
import lessonShareQuery from "./queries/lessonShare/lessonShare.query";
import specialistSubjectListingQuery from "./queries/specialistSubjectListing/specialistSubjectListing.query";
import { pupilLessonQuery } from "./queries/pupilLesson/pupilLesson.query";
import { pupilPreviewLessonQuery } from "./queries/pupilPreviewLesson/pupilPreviewLesson.query";
import { pupilLessonListingQuery } from "./queries/pupilLessonListing/pupilLessonListing.query";
import { pupilProgrammeListingQuery } from "./queries/pupilProgrammeListing/pupilProgrammeListing.query";
import specialistUnitListingQuery from "./queries/specialistUnitListing/specialistUnitListing.query";
import specialistProgrammeListingQuery from "./queries/specialistProgrammeListing/specialistProgrammeListing.query";
import specialistLessonListingQuery from "./queries/specialistLessonListing/specialistLessonListing.query";
import { specialistLessonDownloadQuery } from "./queries/specialistLessonDownload/specialistLessonDownload.query";
import { specialistLessonShareQuery } from "./queries/specialistLessonShare/specialistLessonShare.query";
import specialistLessonOverview from "./queries/specialistLessonOverview/specialistLessonOverview.query";
import specialistLessonOverviewCanonical from "./queries/specialistLessonOverviewCanonical/specialistLessonOverviewCanonical.query";
import { pupilUnitListingQuery } from "./queries/pupilUnitListing/pupilUnitListing.query";
import { pupilSubjectListingQuery } from "./queries/pupilSubjectListing/pupilSubjectListing.query";
import teachersSitemap from "./queries/teachersSitemap/teacherSitemap.query";
import pupilsSitemap from "./queries/pupilsSitemap/pupilsSitemap.query";
import curriculumUnitsIncludeNewQuery from "./queries/curriculumUnitsIncludeNew/curriculumUnitsIncludeNew.query";
import curriculumUnitsIncludeNewSchema from "./queries/curriculumUnitsIncludeNew/curriculumUnitsIncludeNew.schema";
import refreshedMVTimeQuery from "./queries/refreshedMVTime/refreshedMvTime.query";
import teacherPreviewLessonQuery from "./queries/teacherPreviewLesson/teacherPreviewLesson.query";
import curriculumSequenceQuery from "./queries/curriculumSequence/curriculumSequence.query";
import { lessonMediaClipsQuery } from "./queries/lessonMediaClips/lessonMediaClips.query";
import { betaLessonMediaClipsQuery } from "./queries/lessonBetaMediaClips/lessonBetaMediaClips.query";
import curriculumPhaseOptionsQuery from "./queries/curriculumPhaseOptions/curriculumPhaseOptions.query";
import curriculumPhaseOptionsSchema from "./queries/curriculumPhaseOptions/curriculumPhaseOptions.schema";

export const keyStageSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortCode: z.string(),
  displayOrder: z.number().optional(),
});

const teachersHomePageData = z.object({
  keyStages: z.array(keyStageSchema),
});

const genericFilteringGroup = z.object({
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
  subjects: z.array(genericFilteringGroup),
  contentTypes: z.array(contentTypesSchema),
  examBoards: z.array(genericFilteringGroup),
  yearGroups: z.array(genericFilteringGroup),
});

export const subjectPhaseOptionSchema = genericFilteringGroup.extend({
  phases: z.array(genericFilteringGroup),
  keystages: z.array(genericFilteringGroup).optional().nullable(),
  cycle: z.string(),
  ks4_options: z.array(genericFilteringGroup).optional().nullable(),
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

export type Phase = z.infer<typeof genericFilteringGroup>;
export type Subject = z.infer<typeof genericFilteringGroup>;
export type KS4Option = z.infer<typeof genericFilteringGroup>;
export type SubjectPhaseOption = z.infer<typeof subjectPhaseOptionSchema>;
export type CurriculumPhaseOptions = z.infer<
  typeof curriculumPhaseOptionsSchema
>;
export type CurriculumPhaseOption = CurriculumPhaseOptions[number];
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
export type CurriculumUnitsTabDataIncludeNew = z.infer<
  typeof curriculumUnitsIncludeNewSchema
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
  curriculumOverview: curriculumOverviewQuery(sdk),
  curriculumSequence: curriculumSequenceQuery(sdk),
  curriculumUnits: curriculumUnitsQuery(sdk),
  curriculumUnitsIncludeNew: curriculumUnitsIncludeNewQuery(sdk),
  curriculumDownloads: curriculumDownloadsQuery(),
  curriculumHeader: curriculumHeaderQuery(sdk),
  lessonListing: lessonListingQuery(sdk),
  lessonDownloads: lessonDownloadsQuery(sdk),
  lessonMediaClips: lessonMediaClipsQuery(sdk),
  lessonShare: lessonShareQuery(sdk),
  lessonOverview: lessonOverviewQuery(sdk),
  pupilLessonQuery: pupilLessonQuery(sdk),
  pupilPreviewLessonQuery: pupilPreviewLessonQuery(sdk),
  pupilUnitListingQuery: pupilUnitListingQuery(sdk),
  pupilLessonListingQuery: pupilLessonListingQuery(sdk),
  pupilSubjectListingQuery: pupilSubjectListingQuery(sdk),
  pupilProgrammeListingQuery: pupilProgrammeListingQuery(sdk),
  pupilsSitemap: pupilsSitemap(sdk),
  programmeListingPage: programmeListingQuery(sdk),
  refreshedMVTime: refreshedMVTimeQuery(sdk),
  searchPage: searchPageQuery(sdk),
  subjectListingPage: subjectListingQuery(sdk),
  curriculumPhaseOptions: curriculumPhaseOptionsQuery(sdk),
  unitListing: unitListingQuery(sdk),
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();
    const teachersHomePage = getFirstResultOrNull()({
      results: res.teachersHomePage,
    });
    return teachersHomePageData.parse(teachersHomePage);
  },
  teacherPreviewLesson: teacherPreviewLessonQuery(sdk),
  betaLessonMediaClipsQuery: betaLessonMediaClipsQuery(sdk),
  specialistLessonOverview: specialistLessonOverview(sdk),
  specialistLessonOverviewCanonical: specialistLessonOverviewCanonical(sdk),
  specialistSubjectListing: specialistSubjectListingQuery(sdk),
  specialistUnitListing: specialistUnitListingQuery(sdk),
  specialistProgrammeListing: specialistProgrammeListingQuery(sdk),
  specialistLessonListing: specialistLessonListingQuery(sdk),
  specialistLessonDownloads: specialistLessonDownloadQuery(sdk),
  specialistLessonShare: specialistLessonShareQuery(sdk),
  teachersSitemap: teachersSitemap(sdk),
};

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
