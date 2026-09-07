import type { NationalCurriculumInsightsReader } from "../getNationalCurriculumInsightsData";

import guidancePreviewSnapshot from "./nationalCurriculumInsightsGuidancePreviewSnapshot.json";
import previewSnapshot from "./nationalCurriculumInsightsPreviewSnapshot.json";

import {
  nationalCurriculumInsightsGuidancePageSchema,
  nationalCurriculumInsightsHubSchema,
  nationalCurriculumInsightsSubjectSchema,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

const localPreviewHub = nationalCurriculumInsightsHubSchema.parse(
  previewSnapshot.hub,
);
const localPreviewGuidancePage =
  nationalCurriculumInsightsGuidancePageSchema.parse(guidancePreviewSnapshot);
const localPreviewSubjects = previewSnapshot.subjects.map((subject) =>
  nationalCurriculumInsightsSubjectSchema.parse(subject),
);

export const localPreviewSnapshotReader: NationalCurriculumInsightsReader = {
  nationalCurriculumInsightsHub: async () => localPreviewHub,
  nationalCurriculumInsightsGuidancePage: async () => localPreviewGuidancePage,
  nationalCurriculumInsightsSubjectBySlug: async (subjectSlug) =>
    localPreviewSubjects.find(({ slug }) => slug === subjectSlug) ?? null,
};
