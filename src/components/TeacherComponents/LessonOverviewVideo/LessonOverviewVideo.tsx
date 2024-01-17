import { FC, useState } from "react";

import Button, { ButtonProps } from "@/components/SharedComponents/Button";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import { P } from "@/components/SharedComponents/Typography";
import LessonOverviewTranscriptViewer from "@/components/TeacherComponents/LessonOverviewTranscriptViewer";
import Flex from "@/components/SharedComponents/Flex";

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
    <Flex $flexDirection={"column"} $gap={[24]}>
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

      <Flex
        $flexDirection={["column-reverse", "row"]}
        $alignItems={["start", "center"]}
        $gap={[16, 0]}
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
        <Flex $flexGrow={[0, 1]} $justifyContent={["center", "end"]}>
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
        </Flex>
        {!hasCaptions && !signLanguageVideo && (
          <P $mt={24} $textAlign="center">
            Some of our videos, including non-English language videos, do not
            have captions.
          </P>
        )}
      </Flex>

      {transcriptSentences &&
        transcriptSentences.length > 0 &&
        transcriptOn && (
          <LessonOverviewTranscriptViewer
            transcriptSentences={transcriptSentences}
          />
        )}
    </Flex>
  );
};

export default LessonOverviewVideo;
