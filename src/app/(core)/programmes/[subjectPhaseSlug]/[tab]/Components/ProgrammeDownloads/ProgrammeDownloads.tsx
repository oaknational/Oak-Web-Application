"use client";

import { OakBox } from "@oaknational/oak-components";

import CurriculumDownloadTab from "@/components/CurriculumComponents/CurriculumDownloadTab";
import {
  CurriculumDownloadsTierSubjectProps,
  CurriculumUnitsFormattedData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
export type ProgrammeDownloadsProps = {
  mvRefreshTime: number;
  curriculumInfo: CurriculumOverviewMVData;
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps;
  curriculumUnitsFormattedData: CurriculumUnitsFormattedData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
};

export const ProgrammeDownloads = ({
  curriculumDownloadsTabData,
  curriculumUnitsFormattedData,
  curriculumSelectionSlugs,
  ...props
}: ProgrammeDownloadsProps) => {
  // 40px padding on desktop allows the content to fill the max width, but always have inline padding
  // so it doesn't run up against the edge of the screen
  return (
    <OakBox $ph={["spacing-20", "spacing-40"]}>
      <CurriculumDownloadTab
        {...props}
        slugs={curriculumSelectionSlugs}
        tiers={curriculumDownloadsTabData.tiers}
        child_subjects={curriculumDownloadsTabData.child_subjects}
        formattedData={curriculumUnitsFormattedData}
        ph="spacing-0"
      />
    </OakBox>
  );
};
