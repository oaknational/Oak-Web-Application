import { FC, ReactNode } from "react";
import {
  OakBox,
  OakHeading,
  OakTypography,
  OakVideoTranscript,
  OakSignLanguageButton,
  OakCopyLinkButton,
} from "@oaknational/oak-components";

/**
 * This is component with extra information about the video
 *
 */

export type LessonMediaClipInfoProps = {
  clipTitle: string;
  keyStageSlug: string;
  yearSlug: string;
  subjectSlug: string;
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
  keyStageSlug,
  yearSlug,
  subjectSlug,
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
      >{`${keyStageSlug} • ${yearSlug} • ${subjectSlug}`}</OakTypography>
      {videoTranscript && (
        <OakVideoTranscript
          id={"video-transcript"}
          data-testid={"video-transcript"}
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
