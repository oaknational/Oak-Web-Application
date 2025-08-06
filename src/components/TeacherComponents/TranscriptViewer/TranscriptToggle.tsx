import { FC, useId } from "react";
import { OakP, OakVideoTranscript } from "@oaknational/oak-components";

const TranscriptToggle: FC<{
  transcriptSentences: string[];
}> = ({ transcriptSentences }) => {
  const id = useId();
  return (
    <>
      <OakVideoTranscript id={id}>
        {transcriptSentences.map(
          (transcriptSentence, transcriptSentenceIndex) => {
            return (
              <OakP key={transcriptSentenceIndex} $mb="space-between-s">
                {transcriptSentence}
              </OakP>
            );
          },
        )}
      </OakVideoTranscript>
    </>
  );
};

export default TranscriptToggle;
