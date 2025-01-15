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
    <OakBox $width={"all-spacing-20"}>
      <OakFlex
        $alignItems={"center"}
        $flexDirection={"column"}
        $justifyContent={"center"}
        $position={"relative"}
        $height={"all-spacing-20"}
      >
        <OakFlex
          $width={"all-spacing-19"}
          $alignItems={"center"}
          $justifyContent={"center"}
          $zIndex={"in-front"}
          $mb={"space-between-xs"}
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
          $top={"all-spacing-1"}
          $height={"all-spacing-20"}
          $width={"100%"}
        />
      </OakFlex>
      <OakFlex $justifyContent={"end"}>
        <OakSpan $mt="space-between-m" $font={"heading-7"}>
          {label}
        </OakSpan>
      </OakFlex>
    </OakBox>
  );
};

export default LessonOverviewSpeechBubble;
