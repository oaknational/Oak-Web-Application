import React, { FC } from "react";
import {
  OakBox,
  OakFlex,
  OakIcon,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import styled from "styled-components";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { resolveOakHref } from "@/common-lib/urls";
import { Slugs } from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";

type LessonOverviewFilesNeededProps = {
  additionalFiles: string[];
  slugs: Slugs;
};

const CustomBox = styled(OakBox)`
  width: 320px;
`;

const LessonOverviewFilesNeeded: FC<LessonOverviewFilesNeededProps> = ({
  additionalFiles,
  slugs,
}) => {
  const { lessonSlug, unitSlug, programmeSlug } = slugs;
  const isPlural = additionalFiles.length > 1;
  return (
    <CustomBox $background={"aqua50"} $position={"relative"}>
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
        {additionalFiles?.map((file) => {
          return <OakP>{file}</OakP>;
        })}
        <OakP>
          {`Download ${isPlural ? "these files" : "this file"} to use in the
          lesson`}
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
                })
              : resolveOakHref({
                  page: "lesson-downloads-canonical",
                  lessonSlug: lessonSlug,
                  downloads: "downloads",
                })
          }
          isTrailingIcon
          iconName="arrow-right"
        >
          {isPlural ? `Download lesson files` : `Download lesson file`}
        </OakTertiaryButton>
      </OakFlex>
      <BrushBorders color="aqua50" />
    </CustomBox>
  );
};

export default LessonOverviewFilesNeeded;
