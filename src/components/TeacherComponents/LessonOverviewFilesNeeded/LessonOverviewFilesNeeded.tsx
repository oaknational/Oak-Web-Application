import React, { FC } from "react";
import {
  OakBox,
  OakFlex,
  OakIcon,
  OakLI,
  OakP,
  OakTertiaryButton,
  OakUL,
} from "@oaknational/oak-components";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { resolveOakHref } from "@/common-lib/urls";
import { Slugs } from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";
import RedirectToSignUpWhenRestrictedWrapper from "@/components/TeacherComponents/RedirectToSignUpWhenRestrictedWrapper/RedirectToSignUpWhenRestrictedWrapper";

type LessonOverviewFilesNeededProps = {
  contentRestricted: boolean;
  additionalFiles: string[];
  slugs: Slugs;
};

const LessonOverviewFilesNeeded: FC<LessonOverviewFilesNeededProps> = ({
  additionalFiles,
  slugs,
  contentRestricted,
}) => {
  const { lessonSlug, unitSlug, programmeSlug } = slugs;
  const isPlural = additionalFiles.length > 1;
  const filesText = isPlural ? `Download lesson files` : `Download lesson file`;
  const getHref = () => {
    if (contentRestricted) return undefined;
    return programmeSlug && unitSlug
      ? resolveOakHref({
          page: "lesson-downloads",
          lessonSlug: lessonSlug,
          programmeSlug: programmeSlug,
          unitSlug: unitSlug,

          query: {
            preselected: "additional files",
          },
        })
      : resolveOakHref({
          page: "lesson-downloads-canonical",
          lessonSlug: lessonSlug,

          query: {
            preselected: "additional files",
          },
        });
  };
  return (
    <OakBox $background={"aqua50"} $position={"relative"}>
      <OakFlex
        $flexDirection={"column"}
        $pa={"inner-padding-xl"}
        $gap={"all-spacing-4"}
      >
        <OakFlex $flexDirection={"row"} $alignItems={"center"}>
          <OakIcon iconName="additional-material" $width={"all-spacing-5"} />
          <OakP $ml={"space-between-ssx"} $font={"heading-7"}>
            {`${isPlural ? "Files" : "File"} needed for this lesson`}
          </OakP>
        </OakFlex>
        <OakBox>
          <OakUL
            $display={"flex"}
            $flexDirection={"column"}
            $gap={"all-spacing-1"}
            $reset
          >
            {additionalFiles.map((file, index) => {
              return <OakLI key={`${file}-${index}`}>{file}</OakLI>;
            })}
          </OakUL>
        </OakBox>
        <OakP>
          {`Download ${isPlural ? "these files" : "this file"} to use in the
          lesson.`}
        </OakP>
        <RedirectToSignUpWhenRestrictedWrapper
          contentRestricted={contentRestricted}
        >
          <OakTertiaryButton
            element="a"
            href={getHref()}
            isTrailingIcon
            iconName="arrow-right"
          >
            {filesText}
          </OakTertiaryButton>
        </RedirectToSignUpWhenRestrictedWrapper>
      </OakFlex>
      <BrushBorders color="aqua50" />
    </OakBox>
  );
};

export default LessonOverviewFilesNeeded;
