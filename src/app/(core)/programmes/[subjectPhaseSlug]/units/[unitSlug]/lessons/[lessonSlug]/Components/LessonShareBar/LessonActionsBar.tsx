"use client";

import {
  OakFlex,
  OakSmallTertiaryInvertedButton,
  parseSpacing,
} from "@oaknational/oak-components";
import Link from "next/link";
import styled from "styled-components";

import { resolveOakHref } from "@/common-lib/urls";

type LessonShareBarProps = {
  showPupilShare: boolean;
  showCreateWithAi: boolean;
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
};

/**
 * Needed to compensate for the padding on buttons in the share link bar
 */
const NegativeMarginFlex = styled(OakFlex)`
  margin-left: -${parseSpacing("spacing-8")};
`;

export default function LessonActionsBar({
  showPupilShare,
  showCreateWithAi,
  lessonSlug,
  unitSlug,
  programmeSlug,
}: Readonly<LessonShareBarProps>) {
  if (!showPupilShare && !showCreateWithAi) {
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
      {showCreateWithAi && (
        <OakSmallTertiaryInvertedButton
          iconName="external"
          isTrailingIcon
          element="a"
          href="https://labs.thenational.academy/aila"
          target="_blank"
          aria-label="Create more with AI (this will open in a new tab)"
        >
          Create more with AI
        </OakSmallTertiaryInvertedButton>
      )}
    </NegativeMarginFlex>
  );
}
