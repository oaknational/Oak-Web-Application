"use client";

import type { ComponentProps } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { useCurrentSectionId } from "./CurrentSectionIdProvider";

import LessonOverviewSideNavAnchorLinks from "@/components/TeacherComponents/LessonOverviewSideNavAnchorLinks";

type LessonOverviewSideNavProps = Omit<
  ComponentProps<typeof LessonOverviewSideNavAnchorLinks>,
  "currentSectionId"
>;

export default function LessonOverviewSideNav(
  props: Readonly<LessonOverviewSideNavProps>,
) {
  const currentSectionId = useCurrentSectionId();

  return (
    <OakFlex
      as="nav"
      aria-label="page navigation"
      $flexDirection="column"
      $alignItems="flex-start"
      $gap={["spacing-8"]}
      $pr={["spacing-16"]}
      $position="sticky"
      $top="spacing-56"
    >
      <LessonOverviewSideNavAnchorLinks
        {...props}
        currentSectionId={currentSectionId}
      />
    </OakFlex>
  );
}
