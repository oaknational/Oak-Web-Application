import React, { FC } from "react";
import {
  OakBox,
  OakFlex,
  OakIcon,
  OakLI,
  OakP,
  OakUL,
} from "@oaknational/oak-components";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { resolveOakHref } from "@/common-lib/urls";
import { Slugs } from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";
import LoginRequiredButton from "@/components/TeacherComponents/LoginRequiredButton/LoginRequiredButton";

export type LessonOverviewFilesNeededProps = {
  loginRequired: boolean;
  geoRestricted: boolean;
  additionalFiles: string[];
  slugs: Slugs;
};

const LessonOverviewFilesNeeded: FC<LessonOverviewFilesNeededProps> = ({
  additionalFiles,
  slugs,
  loginRequired,
  geoRestricted,
}) => {
  const { lessonSlug, unitSlug, programmeSlug } = slugs;
  const isPlural = additionalFiles.length > 1;
  const filesText = isPlural ? `Download lesson files` : `Download lesson file`;
  const getHref = () => {
    return programmeSlug && unitSlug
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
        });
  };
  return (
    <OakBox $background={"bg-decorative2-subdued"} $position={"relative"}>
      <OakFlex $flexDirection={"column"} $pa={"spacing-24"} $gap={"spacing-16"}>
        <OakFlex $flexDirection={"row"} $alignItems={"center"}>
          <OakIcon iconName="additional-material" $width={"spacing-20"} />
          <OakP $ml={"spacing-8"} $font={"heading-7"}>
            {`${isPlural ? "Files" : "File"} needed for this lesson`}
          </OakP>
        </OakFlex>
        <OakBox>
          <OakUL
            $display={"flex"}
            $flexDirection={"column"}
            $gap={"spacing-4"}
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
        <LoginRequiredButton
          element="a"
          loginRequired={loginRequired}
          geoRestricted={geoRestricted}
          buttonVariant="tertiary"
          signUpProps={{ name: filesText }}
          actionProps={{
            name: filesText,
            href: getHref(),
            isActionGeorestricted: geoRestricted,
            shouldHidewhenGeoRestricted: true,
          }}
        />
      </OakFlex>
      <BrushBorders color="aqua50" />
    </OakBox>
  );
};

export default LessonOverviewFilesNeeded;
