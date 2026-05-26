"use client";

import {
  OakFlex,
  OakSmallTertiaryInvertedButton,
  parseSpacing,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import { resolveOakHref } from "@/common-lib/urls";
import {
  LessonOverviewCreateWithAiDropdown,
  LessonOverviewCreateWithAiProps,
} from "@/components/TeacherComponents/LessonOverviewCreateWithAiDropdown";

type LessonShareBarProps = {
  showPupilShare: boolean;
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
  createWithAiProps?: LessonOverviewCreateWithAiProps;
};

/**
 * Needed to compensate for the padding on buttons in the share link bar
 */
const NegativeMarginFlex = styled(OakFlex)`
  margin-left: -${parseSpacing("spacing-8")};
`;

export default function LessonActionsBar({
  showPupilShare,
  createWithAiProps,
  lessonSlug,
  unitSlug,
  programmeSlug,
}: Readonly<LessonShareBarProps>) {
  if (!showPupilShare && !createWithAiProps) {
    return null;
  }
  const shareHref = resolveOakHref({
    page: "lesson-share",
    lessonSlug,
    unitSlug,
    programmeSlug,
    query: { preselected: "all" },
  });

  return (
    <NegativeMarginFlex
      $display="flex"
      $flexDirection={["column", "row"]}
      $justifyContent={["flex-start", "flex-start", "flex-end"]}
      $gap={["spacing-24", "spacing-40"]}
      $alignItems={"center"}
    >
      {showPupilShare && (
        <OakSmallTertiaryInvertedButton
          element={Link}
          href={shareHref}
          iconName="share"
          isTrailingIcon
          rel="nofollow"
        >
          Share lesson with pupils
        </OakSmallTertiaryInvertedButton>
      )}
      {createWithAiProps && (
        <LessonOverviewCreateWithAiDropdown {...createWithAiProps} />
      )}
    </NegativeMarginFlex>
  );
}
