import { FC } from "react";

import Svg from "../Svg";
import { Span } from "../Typography";

import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";

type SpeechBubbleProps = {
  text?: string | null | undefined;
  label: string;
};
const SpeechBubble: FC<SpeechBubbleProps> = ({ text, label }) => {
  const charCount = text?.length || 0;

  if (charCount > 250 || !text || charCount === 0) {
    return null;
  }

  return (
    <Box $width={320}>
      <Flex
        $alignItems={"center"}
        $flexDirection={"column"}
        $justifyContent={"center"}
        $position={"relative"}
        $height={340}
      >
        <Flex
          $width={220}
          $alignItems={"center"}
          $justifyContent={"center"}
          $zIndex={"inFront"}
          $mb={12}
        >
          <Span
            $textAlign={"center"}
            $font={"heading-7"}
            data-testid={"heading"}
          >
            {text}
          </Span>
        </Flex>
        <Svg
          $position={"absolute"}
          $top={4}
          $height={350}
          name="speech-bubble"
        />
      </Flex>
      <Flex $justifyContent={"end"}>
        <Span $mt={24} $font={"heading-7"}>
          {label}
        </Span>
      </Flex>
    </Box>
  );
};

export default SpeechBubble;
