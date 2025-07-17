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
import { SignUpButton } from "@clerk/nextjs";
import { useRouter } from "next/router";

import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { resolveOakHref } from "@/common-lib/urls";
import { Slugs } from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";

type LessonOverviewFilesNeededProps = {
  geoRestricted: boolean;
  loginRequired: boolean;
  additionalFiles: string[];
  slugs: Slugs;
};

function DownloadButton({
  programmeSlug,
  unitSlug,
  lessonSlug,
  filesText,
  geoRestricted,
  loginRequired,
}: {
  programmeSlug: string | null;
  unitSlug: string | null;
  lessonSlug: string;
  filesText: string;
  geoRestricted: boolean;
  loginRequired: boolean;
}) {
  const { showSignedOutGeoRestricted, showSignedOutLoginRequired } =
    useCopyrightRequirements({ geoRestricted, loginRequired });
  const router = useRouter();
  const redirectToSignUp =
    showSignedOutGeoRestricted || showSignedOutLoginRequired;

  if (redirectToSignUp) {
    return (
      <SignUpButton forceRedirectUrl={router.asPath}>
        <OakTertiaryButton
          data-testid="sign-up-button"
          iconName="arrow-right"
          isTrailingIcon
        >
          {filesText}
        </OakTertiaryButton>
      </SignUpButton>
    );
  }

  return (
    <OakTertiaryButton
      element="a"
      href={
        programmeSlug && unitSlug
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
            })
      }
      isTrailingIcon
      iconName="arrow-right"
    >
      {filesText}
    </OakTertiaryButton>
  );
}

const LessonOverviewFilesNeeded: FC<LessonOverviewFilesNeededProps> = ({
  additionalFiles,
  slugs,
  geoRestricted,
  loginRequired,
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
        <DownloadButton
          geoRestricted={geoRestricted}
          loginRequired={loginRequired}
          programmeSlug={programmeSlug}
          unitSlug={unitSlug}
          lessonSlug={lessonSlug}
          filesText={filesText}
        />
      </OakFlex>
      <BrushBorders color="aqua50" />
    </OakBox>
  );
};

export default LessonOverviewFilesNeeded;
