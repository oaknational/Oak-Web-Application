import { FC, useState } from "react";
import { OakP, OakFlex } from "@oaknational/oak-components";

import Button, { ButtonProps } from "@/components/SharedComponents/Button";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import LessonOverviewTranscriptViewer from "@/components/TeacherComponents/LessonOverviewTranscriptViewer";

export interface LessonOverviewVideoProps {
  video: string | null;
  signLanguageVideo: string | null;
  title: string;
  transcriptSentences?: string[] | null;
  isLegacy: boolean;
}

export const LessonOverviewVideo: FC<LessonOverviewVideoProps> = ({
  video,
  signLanguageVideo,
  title,
  transcriptSentences,
  isLegacy,
}) => {
  const [signLanguageOn, setSignLanguageOn] = useState(false);
  const [transcriptOn, setTranscriptOn] = useState(false);
  const hasCaptions = transcriptSentences && transcriptSentences.length > 0;

  const toggleSignLanguage = () => {
    setSignLanguageOn(!signLanguageOn);
  };

  const toggleTranscript = () => {
    setTranscriptOn(!transcriptOn);
  };

  const buttonParams: Partial<ButtonProps> = {
    variant: "minimal",
    background: "white",
    iconBackground: "blue",
    $iconPosition: "trailing",
  };

  return (
    <OakFlex $flexDirection={"column"} $gap={["all-spacing-6"]}>
      {video && (
        <VideoPlayer
          playbackId={
            signLanguageVideo && signLanguageOn ? signLanguageVideo : video
          }
          playbackPolicy={"signed"}
          title={title}
          location={"lesson"}
          isLegacy={isLegacy}
        />
      )}

      <OakFlex
        $flexDirection={["column-reverse", "row"]}
        $alignItems={["start", "center"]}
        $gap={["all-spacing-4", "all-spacing-0"]}
      >
        {hasCaptions && !transcriptOn && (
          <Button
            label="Show transcript"
            aria-label="Show video transcript"
            icon={"chevron-down"}
            onClick={toggleTranscript}
            {...buttonParams}
          />
        )}
        {hasCaptions && transcriptOn && (
          <Button
            label="Hide transcript"
            aria-label="Hide video transcript"
            icon={"chevron-up"}
            onClick={toggleTranscript}
            {...buttonParams}
          />
        )}
        <OakFlex $flexGrow={[0, 1]} $justifyContent={["center", "end"]}>
          {signLanguageVideo && !signLanguageOn && (
            <Button
              label="Show sign language"
              icon={"sign-language"}
              onClick={toggleSignLanguage}
              {...buttonParams}
            />
          )}
          {signLanguageVideo && signLanguageOn && (
            <Button
              label="Hide sign language"
              background="blue"
              icon={"sign-language"}
              onClick={toggleSignLanguage}
              {...buttonParams}
            />
          )}
        </OakFlex>
        {!hasCaptions && !signLanguageVideo && (
          <OakP $mt="space-between-m" $textAlign="center">
            Some of our videos, including non-English language videos, do not
            have captions.
          </OakP>
        )}
      </OakFlex>

      {transcriptSentences &&
        transcriptSentences.length > 0 &&
        transcriptOn && (
          <LessonOverviewTranscriptViewer
            transcriptSentences={transcriptSentences}
          />
        )}
    </OakFlex>
  );
};

export default LessonOverviewVideo;
