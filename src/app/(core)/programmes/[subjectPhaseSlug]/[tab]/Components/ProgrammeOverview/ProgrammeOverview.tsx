"use client";

import { useRouter } from "next/navigation";

import OverviewTab from "@/components/CurriculumComponents/OverviewTab";
import { OverviewTabProps } from "@/components/CurriculumComponents/OverviewTab/OverviewTab";

export type ProgrammeOverviewProps = OverviewTabProps["data"];

export const ProgrammeOverview = (props: ProgrammeOverviewProps) => {
  const router = useRouter();

  return (
    <OverviewTab
      data={props}
      onClickNavItem={(pathname) => router.push(pathname)}
    />
  );
};
