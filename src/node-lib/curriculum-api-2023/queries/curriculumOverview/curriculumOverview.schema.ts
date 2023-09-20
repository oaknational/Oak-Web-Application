import { z } from "zod";

import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types/curriculumOverview";

const curriculumOverviewSchema = z.object({
  curriculaDesc: z.string(),
  videoGuideDesc: z.string(),
  subjectTitle: z.string(),
  phaseTitle: z.string(),
  examboardTitle: z.string().optional(),
});

export type curriculumOverviewMVSchema = z.infer<
  typeof curriculumOverviewSchema
>;

export type curriculumOverviewTabSchema = {
  curriculumInfo: curriculumOverviewMVSchema;
  curriculumCMSInfo: CurriculumOverviewSanityData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
};

export default curriculumOverviewSchema;
