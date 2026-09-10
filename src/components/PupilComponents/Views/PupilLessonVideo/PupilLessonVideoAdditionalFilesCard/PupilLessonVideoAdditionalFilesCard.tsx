import React from "react";
import {
  OakCardHeader,
  OakFlex,
  OakInfo,
  OakLessonInfoCard,
  OakPrimaryInvertedButton,
  OakUL,
} from "@oaknational/oak-components";

export type PupilLessonVideoAdditionalFilesCardProps = {
  hasAdditionalFiles?: boolean;
  filesCount: number;
  filesListSlot?: React.ReactNode;
  onDownload: () => void;
  isDownloading?: boolean;
};

export const PupilLessonVideoAdditionalFilesCard = ({
  hasAdditionalFiles = false,
  filesCount,
  filesListSlot,
  onDownload,
  isDownloading = false,
}: PupilLessonVideoAdditionalFilesCardProps) => {
  if (!hasAdditionalFiles || filesCount === 0) {
    return null;
  }

  return (
    <OakLessonInfoCard>
      <OakFlex $gap="spacing-16">
        <OakCardHeader iconName="additional-material" tag="h1">
          {`File${filesCount > 1 ? "s" : ""} you will need for this lesson`}
        </OakCardHeader>
        <OakInfo
          hint="Download these files to use in the lesson."
          id="quiz-video-aditional-files"
          tooltipPosition="top-right"
        />
      </OakFlex>

      <OakUL $display="flex" $flexDirection="column" $gap="spacing-16" $reset>
        {filesListSlot}
      </OakUL>

      <OakPrimaryInvertedButton
        onClick={onDownload}
        isLoading={isDownloading}
        iconName="download"
        isTrailingIcon
        $font="heading-7"
        $pl="spacing-0"
        $pr="spacing-0"
      >
        {filesCount === 1 ? "Download file" : "Download files"}
      </OakPrimaryInvertedButton>
    </OakLessonInfoCard>
  );
};
