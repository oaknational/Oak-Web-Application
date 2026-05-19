import {
  OakFlex,
  OakHeading,
  OakP,
  OakSpan,
} from "@oaknational/oak-components";

export const SharePageNumberedHeading = ({
  number,
  title,
  paragraph,
}: {
  number: number;
  title: string;
  paragraph: string;
}) => {
  return (
    <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
      <OakHeading tag="h2" $font={"heading-5"}>
        <OakFlex $alignItems={"center"}>
          <OakFlex
            $background={"bg-btn-secondary"}
            $borderRadius={"border-radius-circle"}
            $width={"spacing-48"}
            $height={"spacing-48"}
            $pa={"spacing-8"}
            $borderColor={"icon-primary"}
            $borderStyle={"solid"}
            $alignItems={"center"}
            $justifyContent={"center"}
          >
            <OakSpan $font={"body-1-bold"}>{number}</OakSpan>
          </OakFlex>
          <OakSpan $ml={"spacing-16"}>{title}</OakSpan>
        </OakFlex>
      </OakHeading>
      <OakP $font={"body-1"}>{paragraph}</OakP>
    </OakFlex>
  );
};
