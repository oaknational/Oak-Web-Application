import { FC, useState } from "react";
import { OakBox } from "@oaknational/oak-components";

import TranscriptViewer from "./TranscriptViewer";

import Button from "@/components/SharedComponents/Button";

const TranscriptToggle: FC<{
  transcriptSentences: string[];
}> = ({ transcriptSentences }) => {
  const [transcriptOn, setTranscriptOn] = useState(false);

  const toggleTranscript = () => {
    setTranscriptOn(!transcriptOn);
  };
  return (
    <>
      <OakBox>
        <Button
          label={transcriptOn ? "Hide transcript" : "Show transcript"}
          icon={transcriptOn ? "chevron-up" : "chevron-down"}
          onClick={toggleTranscript}
          variant="minimal"
          background="white"
          iconBackground="blue"
          $iconPosition="trailing"
          aria-controls="transcript-viewer"
          aria-expanded={transcriptOn}
        />
      </OakBox>
      {transcriptOn && (
        <TranscriptViewer transcriptSentences={transcriptSentences} />
      )}
    </>
  );
};

export default TranscriptToggle;
