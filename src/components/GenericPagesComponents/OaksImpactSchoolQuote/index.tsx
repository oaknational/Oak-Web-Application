import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
  OakQuote,
  OakQuoteProps,
} from "@oaknational/oak-components";

export type OaksImpactSchoolQuoteProps = {
  title: string;
  image: {
    alt: string;
    src: string;
  };
  subTitle: string;
  quote: OakQuoteProps;
};
export function OaksImpactSchoolQuote({
  title,
  image,
  subTitle,
  quote,
}: Readonly<OaksImpactSchoolQuoteProps>) {
  return (
    <OakFlex
      $flexDirection={"column"}
      $background={"bg-neutral"}
      $ba="border-solid-m"
      $borderColor="border-neutral-lighter"
      $borderRadius={"border-radius-l"}
      $overflow="hidden"
    >
      <OakImage {...image} $aspectRatio={"16/9"} />
      <OakFlex
        $flexDirection={"column"}
        $ph={"spacing-24"}
        $pv={"spacing-32"}
        $gap={"spacing-32"}
      >
        <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
          <OakHeading tag={"h3"} $color={"text-primary"} $font={"heading-5"}>
            {title}
          </OakHeading>
          <OakP $color={"text-primary"} $font={"body-2"}>
            {subTitle}
          </OakP>
        </OakFlex>
        <OakBox $height="spacing-2" style={{ background: "#D9D9D9" }} />
        <OakFlex $flexDirection={"column"}>
          <OakFlex $flexDirection={"column"}>
            <OakFlex $flexDirection={"column"}>
              <OakFlex $alignItems={"flex-start"}>
                <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
                  <OakQuote {...quote} />
                </OakFlex>
              </OakFlex>
            </OakFlex>
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
}
