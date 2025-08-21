import { FC, ReactNode } from "react";
import {
  OakBox,
  OakHeading,
  OakVideoTranscript,
  OakSignLanguageButton,
  OakCopyLinkButton,
} from "@oaknational/oak-components";

import LessonMetadata from "@/components/SharedComponents/LessonMetadata";

/**
 * This is component with extra information about the video
 *
 */

export type LessonMediaClipInfoProps = {
  clipTitle: string;
  keyStageTitle: string;
  yearTitle: string;
  subjectTitle: string;
  videoTranscript?: ReactNode;
  signLanguageButtonEnabled?: boolean;
  copyLinkButtonEnabled?: boolean;
  isMobile: boolean;
  onSignLanguageButtonClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  copyLinkHref?: string;
};

export const LessonMediaClipInfo: FC<LessonMediaClipInfoProps> = ({
  clipTitle,
  keyStageTitle,
  yearTitle,
  subjectTitle,
  videoTranscript,
  signLanguageButtonEnabled = false,
  onSignLanguageButtonClick = () => {},
  copyLinkButtonEnabled = false,
  isMobile,
}: LessonMediaClipInfoProps) => {
  return (
    <OakBox>
      <OakHeading tag="h5" $font={"heading-5"} $mb="space-between-xs">
        {clipTitle}
      </OakHeading>
      <LessonMetadata
        keyStageTitle={keyStageTitle}
        yearTitle={yearTitle}
        subjectTitle={subjectTitle}
        $color={"grey60"}
        $mb="space-between-m"
      />
      <OakVideoTranscript
        id={`video-transcript-${isMobile ? "mobile" : "desktop"}`}
        signLanguageControl={
          signLanguageButtonEnabled && (
            <OakSignLanguageButton onClick={onSignLanguageButtonClick} />
          )
        }
        copyLinkControl={copyLinkButtonEnabled && <OakCopyLinkButton />}
      >
        {videoTranscript}
      </OakVideoTranscript>
    </OakBox>
  );
};
