import { FC } from "react";
import { OakSpan } from "@oaknational/oak-components";

import Svg from "@/components/SharedComponents/Svg";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";

type LessonOverviewSpeechBubbleProps = {
  text?: string | null | undefined;
  label: string;
};
const LessonOverviewSpeechBubble: FC<LessonOverviewSpeechBubbleProps> = ({
  text,
  label,
}) => {
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
          <OakSpan
            $textAlign={"center"}
            $font={"heading-7"}
            data-testid={"heading"}
          >
            {text}
          </OakSpan>
        </Flex>
        <Svg
          $position={"absolute"}
          $top={4}
          $height={350}
          name="speech-bubble"
        />
      </Flex>
      <Flex $justifyContent={"end"}>
        <OakSpan $mt="space-between-m" $font={"heading-7"}>
          {label}
        </OakSpan>
      </Flex>
    </Box>
  );
};

export default LessonOverviewSpeechBubble;
