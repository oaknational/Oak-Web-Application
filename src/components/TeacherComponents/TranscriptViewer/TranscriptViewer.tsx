import { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { OakP, OakFlex, OakBox } from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";

export interface TranscriptViewerProps {
  transcriptSentences: string[] | null;
}

export const TranscriptViewer: FC<TranscriptViewerProps> = ({
  transcriptSentences,
}) => (
  <OakFlex $width={"100%"} $justifyContent={"center"} id="transcript-viewer">
    <OakBox
      role="article"
      aria-label="The video transcript"
      $width={["100%"]}
      $maxHeight={["spacing-360", "spacing-640", "spacing-640"]}
      $background="grey30"
      $ph="spacing-16"
      $pv="spacing-32"
      $borderRadius={["border-radius-m2", "border-radius-s", "border-radius-s"]}
    >
      <Flex
        $maxHeight={[320, 580, 580]}
        $overflowY={"scroll"}
        $width={"100%"}
        $pr={32}
        tabIndex={0}
        $flexDirection={"column"}
        $alignItems={"start"}
      >
        <OakBox $maxWidth={["spacing-640"]}>
          {transcriptSentences?.map((transcriptSentence: string) => (
            <OakP
              $mb={["spacing-24", "spacing-16"]}
              $font={"body-1"}
              key={uuidv4()}
            >
              {transcriptSentence}
            </OakP>
          ))}
        </OakBox>
      </Flex>
    </OakBox>
  </OakFlex>
);

export default TranscriptViewer;
