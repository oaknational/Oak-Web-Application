import { z } from "zod";

import sdk from "./sdk";
import lessonOverviewQuery from "./queries/lessonOverview/lessonOverview.query";
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
import curriculumOverviewSchema from "./queries/curriculumOverview/curriculumOverview.schema";
import searchPageQuery from "./queries/searchPage/searchPage.query";
import lessonShareQuery from "./queries/lessonShare/lessonShare.query";
import specialistSubjectListingQuery from "./queries/specialistSubjectListing/specialistSubjectListing.query";
import { pupilLessonQuery as _pupilLessonQuery } from "./queries/pupilLesson/pupilLesson.query";
import { pupilPreviewLessonQuery as _pupilPreviewLessonQuery } from "./queries/pupilPreviewLesson/pupilPreviewLesson.query";
import { pupilLessonListingQuery as _pupilLessonListingQuery } from "./queries/pupilLessonListing/pupilLessonListing.query";
import { pupilProgrammeListingQuery as _pupilProgrammeListingQuery } from "./queries/pupilProgrammeListing/pupilProgrammeListing.query";
import specialistUnitListingQuery from "./queries/specialistUnitListing/specialistUnitListing.query";
import specialistProgrammeListingQuery from "./queries/specialistProgrammeListing/specialistProgrammeListing.query";
import specialistLessonListingQuery from "./queries/specialistLessonListing/specialistLessonListing.query";
import { specialistLessonDownloadQuery } from "./queries/specialistLessonDownload/specialistLessonDownload.query";
import { specialistLessonShareQuery } from "./queries/specialistLessonShare/specialistLessonShare.query";
import _specialistLessonOverview from "./queries/specialistLessonOverview/specialistLessonOverview.query";
import _specialistLessonOverviewCanonical from "./queries/specialistLessonOverviewCanonical/specialistLessonOverviewCanonical.query";
import { pupilUnitListingQuery as _pupilUnitListingQuery } from "./queries/pupilUnitListing/pupilUnitListing.query";
import { pupilSubjectListingQuery as _pupilSubjectListingQuery } from "./queries/pupilSubjectListing/pupilSubjectListing.query";
import _teachersSitemap from "./queries/teachersSitemap/teacherSitemap.query";
import _pupilsSitemap from "./queries/pupilsSitemap/pupilsSitemap.query";
import subjectPhaseOptionsIncludeNewQuery from "./queries/subjectPhaseOptionsIncludeNew/subjectPhaseOptionsIncludeNew.query";
import curriculumUnitsIncludeNewQuery from "./queries/curriculumUnitsIncludeNew/curriculumUnitsIncludeNew.query";
import curriculumUnitsIncludeNewSchema from "./queries/curriculumUnitsIncludeNew/curriculumUnitsIncludeNew.schema";
import refreshedMVTimeQuery from "./queries/refreshedMVTime/refreshedMvTime.query";
import teacherPreviewLessonQuery from "./queries/teacherPreviewLesson/teacherPreviewLesson.query";
import curriculumSequenceQuery from "./queries/curriculumSequence/curriculumSequence.query";

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
  lessonShare: lessonShareQuery(sdk),
  lessonOverview: lessonOverviewQuery(sdk),
  pupilLessonQuery: _pupilLessonQuery(sdk),
  pupilPreviewLessonQuery: _pupilPreviewLessonQuery(sdk),
  pupilUnitListingQuery: _pupilUnitListingQuery(sdk),
  pupilLessonListingQuery: _pupilLessonListingQuery(sdk),
  pupilSubjectListingQuery: _pupilSubjectListingQuery(sdk),
  pupilProgrammeListingQuery: _pupilProgrammeListingQuery(sdk),
  pupilsSitemap: _pupilsSitemap(sdk),
  programmeListingPage: programmeListingQuery(sdk),
  refreshedMVTime: refreshedMVTimeQuery(sdk),
  searchPage: searchPageQuery(sdk),
  subjectListingPage: subjectListingQuery(sdk),
  subjectPhaseOptions: subjectPhaseOptionsQuery(sdk),
  subjectPhaseOptionsIncludeNew: subjectPhaseOptionsIncludeNewQuery(sdk),
  unitListing: unitListingQuery(sdk),
  teachersHomePage: async () => {
    const res = await sdk.teachersHomePage();
    const teachersHomePage = getFirstResultOrNull()({
      results: res.teachersHomePage,
    });
    return teachersHomePageData.parse(teachersHomePage);
  },
  teacherPreviewLesson: teacherPreviewLessonQuery(sdk),
  specialistLessonOverview: _specialistLessonOverview(sdk),
  specialistLessonOverviewCanonical: _specialistLessonOverviewCanonical(sdk),
  specialistSubjectListing: specialistSubjectListingQuery(sdk),
  specialistUnitListing: specialistUnitListingQuery(sdk),
  specialistProgrammeListing: specialistProgrammeListingQuery(sdk),
  specialistLessonListing: specialistLessonListingQuery(sdk),
  specialistLessonDownloads: specialistLessonDownloadQuery(sdk),
  specialistLessonShare: specialistLessonShareQuery(sdk),
  teachersSitemap: _teachersSitemap(sdk),
};

export const curriculumOverview = curriculumApi2023.curriculumOverview;
export const curriculumSequence = curriculumApi2023.curriculumSequence;
export const curriculumUnits = curriculumApi2023.curriculumUnits;
export const curriculumUnitsIncludeNew =
  curriculumApi2023.curriculumUnitsIncludeNew;
export const curriculumDownloads = curriculumApi2023.curriculumDownloads;
export const curriculumHeader = curriculumApi2023.curriculumHeader;
export const lessonListing = curriculumApi2023.lessonListing;
export const lessonDownloads = curriculumApi2023.lessonDownloads;
export const lessonShare = curriculumApi2023.lessonShare;
export const lessonOverview = curriculumApi2023.lessonOverview;
export const pupilLessonQuery = curriculumApi2023.pupilLessonQuery;
export const pupilPreviewLessonQuery =
  curriculumApi2023.pupilPreviewLessonQuery;
export const pupilUnitListingQuery = curriculumApi2023.pupilUnitListingQuery;
export const pupilLessonListingQuery =
  curriculumApi2023.pupilLessonListingQuery;
export const pupilSubjectListingQuery =
  curriculumApi2023.pupilSubjectListingQuery;
export const pupilProgrammeListingQuery =
  curriculumApi2023.pupilProgrammeListingQuery;
export const pupilsSitemap = curriculumApi2023.pupilsSitemap;
export const programmeListingPage = curriculumApi2023.programmeListingPage;
export const refreshedMVTime = curriculumApi2023.refreshedMVTime;
export const searchPage = curriculumApi2023.searchPage;
export const subjectListingPage = curriculumApi2023.subjectListingPage;
export const subjectPhaseOptions = curriculumApi2023.subjectPhaseOptions;
export const subjectPhaseOptionsIncludeNew =
  curriculumApi2023.subjectPhaseOptionsIncludeNew;
export const unitListing = curriculumApi2023.unitListing;
export const teachersHomePage = curriculumApi2023.teachersHomePage;
export const teacherPreviewLesson = curriculumApi2023.teacherPreviewLesson;
export const specialistLessonOverview =
  curriculumApi2023.specialistLessonOverview;
export const specialistLessonOverviewCanonical =
  curriculumApi2023.specialistLessonOverviewCanonical;
export const specialistSubjectListing =
  curriculumApi2023.specialistSubjectListing;
export const specialistUnitListing = curriculumApi2023.specialistUnitListing;
export const specialistProgrammeListing =
  curriculumApi2023.specialistProgrammeListing;
export const specialistLessonListing =
  curriculumApi2023.specialistLessonListing;
export const specialistLessonDownloads =
  curriculumApi2023.specialistLessonDownloads;
export const specialistLessonShare = curriculumApi2023.specialistLessonShare;
export const teachersSitemap = curriculumApi2023.teachersSitemap;

export type CurriculumApi = typeof curriculumApi2023;
export default curriculumApi2023;
