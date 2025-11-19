import { FC } from "react";
import { OakSpan, OakIcon, OakBox, OakFlex } from "@oaknational/oak-components";

type LessonOverviewSpeechBubbleProps = {
  text?: string | null | undefined;
  label: string;
};
const LessonOverviewSpeechBubble: FC<LessonOverviewSpeechBubbleProps> = ({
  text,
  label,
}) => {
  const charCount = text?.length || 0;

  if (charCount > 300 || !text || charCount === 0) {
    return null;
  }

  return (
    <OakBox $width={"spacing-360"}>
      <OakFlex
        $alignItems={"center"}
        $flexDirection={"column"}
        $justifyContent={"center"}
        $position={"relative"}
        $height={"spacing-360"}
      >
        <OakFlex
          $width={"spacing-240"}
          $alignItems={"center"}
          $justifyContent={"center"}
          $zIndex={"in-front"}
          $mb={"spacing-12"}
        >
          <OakSpan
            $textAlign={"center"}
            $font={"heading-7"}
            data-testid={"heading"}
          >
            {text}
          </OakSpan>
        </OakFlex>
        <OakIcon
          iconName="speech-bubble"
          $position={"absolute"}
          $top={"spacing-4"}
          $height={"spacing-360"}
          $width={"100%"}
        />
      </OakFlex>
      <OakFlex $justifyContent={"end"}>
        <OakSpan $mt="spacing-24" $font={"heading-7"}>
          {label}
        </OakSpan>
      </OakFlex>
    </OakBox>
  );
};

export default LessonOverviewSpeechBubble;
