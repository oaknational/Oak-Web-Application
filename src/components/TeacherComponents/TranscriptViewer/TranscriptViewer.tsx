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
      $maxHeight={["all-spacing-20", "all-spacing-22", "all-spacing-22"]}
      $background="grey30"
      $ph="inner-padding-m"
      $pv="inner-padding-xl2"
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
        <OakBox $maxWidth={["all-spacing-22"]}>
          {transcriptSentences?.map((transcriptSentence: string) => (
            <OakP
              $mb={["space-between-m", "space-between-s"]}
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
