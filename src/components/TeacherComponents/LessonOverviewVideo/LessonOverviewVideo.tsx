import { FC, useState } from "react";
import { OakP, OakFlex } from "@oaknational/oak-components";

import { AnalyticsBrowseData } from "../types/lesson.types";

import Button, { ButtonProps } from "@/components/SharedComponents/Button";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import TranscriptViewer from "@/components/TeacherComponents/TranscriptViewer";

export interface LessonOverviewVideoProps {
  video: string | null;
  signLanguageVideo: string | null;
  title: string;
  transcriptSentences?: string[] | string | null;
  isLegacy: boolean;
  browsePathwayData: AnalyticsBrowseData;
}

export const LessonOverviewVideo: FC<LessonOverviewVideoProps> = ({
  video,
  signLanguageVideo,
  title,
  transcriptSentences,
  isLegacy,
  browsePathwayData,
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
    <OakFlex $flexDirection={"column"} $gap={["spacing-24"]}>
      {video && (
        <VideoPlayer
          playbackId={
            signLanguageVideo && signLanguageOn ? signLanguageVideo : video
          }
          playbackPolicy={"signed"}
          title={title}
          location={"lesson"}
          isLegacy={isLegacy}
          defaultHiddenCaptions={signLanguageOn}
          pathwayData={browsePathwayData}
        />
      )}
      <OakFlex
        $flexDirection={["column-reverse", "row"]}
        $alignItems={["start", "center"]}
        $gap={["spacing-16", "spacing-0"]}
      >
        {hasCaptions && (
          <Button
            label={transcriptOn ? "Hide transcript" : "Show transcript"}
            icon={transcriptOn ? "chevron-up" : "chevron-down"}
            onClick={toggleTranscript}
            {...buttonParams}
            aria-controls="transcript-viewer"
            aria-expanded={transcriptOn}
          />
        )}
        <OakFlex $flexGrow={[0, 1]} $justifyContent={["center", "end"]}>
          {signLanguageVideo && (
            <Button
              label={
                signLanguageOn ? "Hide sign language" : "Show sign language"
              }
              icon={"sign-language"}
              onClick={toggleSignLanguage}
              background={signLanguageOn ? "blue" : "white"}
              {...buttonParams}
            />
          )}
        </OakFlex>
        {!hasCaptions && !signLanguageVideo && (
          <OakP $mt="spacing-24" $textAlign="center">
            Some of our videos, including non-English language videos, do not
            have captions.
          </OakP>
        )}
      </OakFlex>
      {transcriptSentences &&
        transcriptSentences.length > 0 &&
        transcriptOn && (
          <TranscriptViewer
            transcriptSentences={
              Array.isArray(transcriptSentences)
                ? transcriptSentences
                : [transcriptSentences]
            }
          />
        )}
    </OakFlex>
  );
};

export default LessonOverviewVideo;
