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

type LessonOverviewFilesNeededProps = {
  additionalFiles: string[];
  slugs: Slugs;
};

const LessonOverviewFilesNeeded: FC<LessonOverviewFilesNeededProps> = ({
  additionalFiles,
  slugs,
}) => {
  const { lessonSlug, unitSlug, programmeSlug } = slugs;
  const isPlural = additionalFiles.length > 1;
  const filesText = isPlural ? `Download lesson files` : `Download lesson file`;
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
        <OakTertiaryButton
          element="a"
          href={
            programmeSlug && unitSlug
              ? resolveOakHref({
                  page: "lesson-downloads",
                  lessonSlug: lessonSlug,
                  programmeSlug: programmeSlug,
                  unitSlug: unitSlug,
                  downloads: "downloads",
                  query: {
                    preselected: "additional files",
                  },
                })
              : resolveOakHref({
                  page: "lesson-downloads-canonical",
                  lessonSlug: lessonSlug,
                  downloads: "downloads",
                  query: {
                    preselected: "additional files",
                  },
                })
          }
          isTrailingIcon
          iconName="arrow-right"
        >
          {filesText}
        </OakTertiaryButton>
      </OakFlex>
      <BrushBorders color="aqua50" />
    </OakBox>
  );
};

export default LessonOverviewFilesNeeded;
