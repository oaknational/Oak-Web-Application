import React from "react";
import {
  OakLessonVideoTranscript,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";

export type PupilLessonVideoTranscriptProps = {
  transcriptSentences: string[];
  onTranscriptToggled?: ({ isOpen }: { isOpen: boolean }) => void;
  showSignLanguageToggle?: boolean;
  signLanguageOn?: boolean;
  onSignLanguageToggle?: () => void;
};

export const PupilLessonVideoTranscript = ({
  transcriptSentences,
  onTranscriptToggled,
  showSignLanguageToggle = false,
  signLanguageOn = false,
  onSignLanguageToggle,
}: PupilLessonVideoTranscriptProps) => {
  if (transcriptSentences.length === 0) {
    return null;
  }

  return (
    <OakLessonVideoTranscript
      id="video-transcript"
      transcriptToggled={onTranscriptToggled}
      signLanguageControl={
        showSignLanguageToggle ? (
          <OakTertiaryButton
            onClick={onSignLanguageToggle}
            iconName="sign-language"
            isTrailingIcon
          >
            {signLanguageOn ? "Hide sign language" : "Show sign language"}
          </OakTertiaryButton>
        ) : null
      }
    >
      {transcriptSentences.map((sentence) => (
        <OakP key={sentence} $mb="spacing-16">
          {sentence}
        </OakP>
      ))}
    </OakLessonVideoTranscript>
  );
};
