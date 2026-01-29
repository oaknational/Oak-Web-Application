"use client";

import { useRouter } from "next/navigation";
import { OakBox } from "@oaknational/oak-components";

import OverviewTab from "@/components/CurriculumComponents/OverviewTab";
import { OverviewTabProps } from "@/components/CurriculumComponents/OverviewTab/OverviewTab";

export type ProgrammeOverviewProps = OverviewTabProps["data"];

export const ProgrammeOverview = (props: ProgrammeOverviewProps) => {
  const router = useRouter();

  // 40px padding on desktop allows the content to fill the max width, but always have inline padding
  // so it doesn't run up against the edge of the screen
  return (
    <OakBox
      $ph={["spacing-0", "spacing-0", "spacing-40"]}
      $mt={["spacing-16", "spacing-48", "spacing-0"]}
    >
      <OverviewTab
        data={props}
        ph={["spacing-20", "spacing-40", "spacing-0"]}
        onClickNavItem={(pathname) => router.push(pathname)}
      />
    </OakBox>
  );
};
