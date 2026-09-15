"use client";

import type { ComponentProps } from "react";
import { OakBox, OakFlex } from "@oaknational/oak-components";

import { useCurrentSectionId } from "./CurrentSectionIdProvider";

import { getLessonSlugFromProgrammeState } from "@/context/TeacherBrowseAnalytics/utils/getLessonSlugFromProgrammeState";
import { resolveOakHref } from "@/common-lib/urls";
import LessonOverviewSideNavAnchorLinks from "@/components/TeacherComponents/LessonOverviewSideNavAnchorLinks";
import { TeachWithOakPromoSection } from "@/components/TeacherComponents/TeachWithOakPromoSection/TeachWithOakPromoSection";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

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

  const programmeState = useTeacherBrowseAnalytics((s) => s.programmeState);
  const lessonSlug = getLessonSlugFromProgrammeState(programmeState);
  const lessonHref =
    programmeState?.browseLevel === "lesson" && lessonSlug
      ? resolveOakHref({
          page: "lesson-overview",
          lessonSlug,
          programmeSlug: programmeState.programmeSlug,
          unitSlug: programmeState.unit.slug,
        })
      : undefined;

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
      <OakBox
        $display={["none", "block"]}
        data-test-id="mobile-teach-with-oak-promo"
      >
        <LessonOverviewSideNavAnchorLinks
          {...linkProps}
          currentSectionId={currentSectionId}
        />
      </OakBox>
      {showPromoSection && lessonHref && (
        <TeachWithOakPromoSection returnTo={lessonHref} />
      )}
    </OakFlex>
  );
}
