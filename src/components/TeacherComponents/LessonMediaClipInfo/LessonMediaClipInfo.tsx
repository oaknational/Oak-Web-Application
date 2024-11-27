import { FC, ReactNode } from "react";
import {
  OakBox,
  OakHeading,
  OakTypography,
  OakVideoTranscript,
  OakSignLanguageButton,
  OakCopyLinkButton,
  OakFlex,
  OakSpan,
} from "@oaknational/oak-components";

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
  copyLinkHref,
}: LessonMediaClipInfoProps) => {
  return (
    <OakBox>
      <OakHeading tag="h5" $font={"heading-5"} $mb="space-between-xs">
        {clipTitle}
      </OakHeading>
      <OakTypography
        $font={"heading-light-7"}
        $color={"grey60"}
        $mb="space-between-m"
      >
        <OakFlex $flexDirection="row" $gap={"space-between-ssx"}>
          <OakSpan>{keyStageTitle}</OakSpan>
          <OakSpan>•</OakSpan>
          <OakSpan>{yearTitle}</OakSpan>
          <OakSpan>•</OakSpan>
          <OakSpan>{subjectTitle}</OakSpan>
        </OakFlex>
      </OakTypography>
      {videoTranscript && (
        <OakVideoTranscript
          id={"video-transcript"}
          signLanguageControl={
            signLanguageButtonEnabled && (
              <OakSignLanguageButton onClick={onSignLanguageButtonClick} />
            )
          }
          copyLinkControl={
            copyLinkButtonEnabled && <OakCopyLinkButton href={copyLinkHref} />
          }
        >
          <>{videoTranscript}</>
        </OakVideoTranscript>
      )}
    </OakBox>
  );
};
