"use client";

import type { ComponentProps } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { useCurrentSectionId } from "./CurrentSectionIdProvider";

import LessonOverviewSideNavAnchorLinks from "@/components/TeacherComponents/LessonOverviewSideNavAnchorLinks";
import { TeachWithOakPromoSection } from "@/components/TeacherComponents/TeachWithOakPromoSection/TeachWithOakPromoSection";

type LessonOverviewSideNavProps = Omit<
  ComponentProps<typeof LessonOverviewSideNavAnchorLinks>,
  "currentSectionId"
> & {
  showPromoSection?: boolean;
};

export default function LessonOverviewSideNav(
  props: Readonly<LessonOverviewSideNavProps>,
) {
  const currentSectionId = useCurrentSectionId();
  const { showPromoSection, ...linkProps } = props;

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
      $width="100%"
    >
      <LessonOverviewSideNavAnchorLinks
        {...linkProps}
        currentSectionId={currentSectionId}
      />
      {showPromoSection && <TeachWithOakPromoSection />}
    </OakFlex>
  );
}
