import { FC } from "react";

import Box from "../../Box";
import { P } from "../../Typography";
import Flex from "../../Flex";

interface OverviewTranscriptProps {
  transcriptSentences: string[];
}

export const OverviewTranscript: FC<OverviewTranscriptProps> = ({
  transcriptSentences,
}) => {
  return (
    <Flex $width={"100%"} $justifyContent={"center"} data-testid="transcript">
      <Box
        $width={["100%", "70%", "60%"]}
        $maxHeight={[380, 640, 640]}
        $background="oakGrey2"
        $ph={16}
        $pv={32}
        $mt={20}
        $borderRadius={[8, 3, 3]}
      >
        <Box
          $maxHeight={[320, 580, 580]}
          $overflowY={"scroll"}
          $pr={32}
          tabIndex={0}
        >
          {transcriptSentences.map(
            (transcriptSentence: string, index: number) => (
              <P $mb={[24, 16]} $font={"body-1"} key={index}>
                {transcriptSentence}
              </P>
            )
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default OverviewTranscript;
