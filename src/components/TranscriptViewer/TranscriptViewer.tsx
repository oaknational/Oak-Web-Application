import { FC } from "react";
import { v4 as uuidv4 } from "uuid";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import { P } from "@/components/SharedComponents/Typography";

export interface TranscriptViewerProps {
  transcriptSentences: string[] | null;
}

export const TranscriptViewer: FC<TranscriptViewerProps> = ({
  transcriptSentences,
}) => (
  <Flex $width={"100%"} $justifyContent={"center"}>
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
            <P $mb={[24, 16]} $font={"body-1"} key={uuidv4()}>
              {transcriptSentence}
            </P>
          ))}
        </Box>
      </Flex>
    </Box>
  </Flex>
);

export default TranscriptViewer;
