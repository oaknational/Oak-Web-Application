import { FC } from "react";

import { OakBox, OakFlex, OakHeading, OakTypography } from "@oaknational/oak-components";
import TranscriptToggle from "@/components/TeacherComponents/TranscriptViewer/TranscriptToggle";

/**
 * This is component with extra information about the video
 *
 */

export type LessonMediaClipInfoProps = {
  clipTitle: string;
  keyStageSlug: string;
  yearSlug: string;
  subjectSlug: string;
};

const LessonMediaClipInfo: FC<LessonMediaClipInfoProps> = ({ clipTitle, keyStageSlug, yearSlug, subjectSlug }: LessonMediaClipInfoProps) => {
  return (
    <OakBox>
      <OakHeading tag="h5" $font={"heading-5"} $mb="space-between-s">{clipTitle}</OakHeading>
      <OakTypography $font={"heading-light-7"} $mb="space-between-m">{`${keyStageSlug} • ${yearSlug} • ${subjectSlug}`}</OakTypography>
      <OakFlex>
        <TranscriptToggle transcriptSentences={[""]} />
      </OakFlex>
    </OakBox>
  );
};

export default LessonMediaClipInfo;
