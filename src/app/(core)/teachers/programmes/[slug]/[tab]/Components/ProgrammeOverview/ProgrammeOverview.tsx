"use client";

import { useRouter } from "next/navigation";

import OverviewTab from "@/components/CurriculumComponents/OverviewTab";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";

export const ProgrammeOverview = (props: {
  curriculumCMSInfo: CurriculumOverviewSanityData;
}) => {
  const router = useRouter();
  /**
   * 40px padding on desktop allows the content to fill the max width, but always have inline padding
   * so it doesn't run up against the edge of the screen
   */
  return (
    <OverviewTab
      curriculumCMSInfo={props.curriculumCMSInfo}
      ph={["spacing-20", "spacing-40", "spacing-0"]}
      outerPh={["spacing-0", "spacing-0", "spacing-40"]}
      onClickNavItem={(pathname) => router.replace(pathname)}
    />
  );
};
