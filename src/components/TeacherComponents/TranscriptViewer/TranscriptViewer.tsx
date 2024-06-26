import { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { OakP, OakFlex } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export interface TranscriptViewerProps {
  transcriptSentences: string[] | null;
}

export const TranscriptViewer: FC<TranscriptViewerProps> = ({
  transcriptSentences,
}) => (
  <OakFlex $width={"100%"} $justifyContent={"center"} id="transcript-viewer">
    <Box
      role="article"
      aria-label="The video transcript"
      $width={["100%"]}
      $maxHeight={[380, 640, 640]}
      $background="grey30"
      $ph={16}
      $pv={32}
      $borderRadius={[8, 3, 3]}
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
        <Box $maxWidth={[640]}>
          {transcriptSentences?.map((transcriptSentence: string) => (
            <OakP
              $mb={["space-between-m", "space-between-s"]}
              $font={"body-1"}
              key={uuidv4()}
            >
              {transcriptSentence}
            </OakP>
          ))}
        </Box>
      </Flex>
    </Box>
  </OakFlex>
);

export default TranscriptViewer;
