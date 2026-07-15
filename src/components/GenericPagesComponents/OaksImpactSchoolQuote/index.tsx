import styled from "styled-components";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";

const StyledAuthorImage = styled(OakImage)`
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  img {
    border-radius: 50%;
  }
`;

const TightLetterSpacing = styled(OakBox)`
  letter-spacing: -0.01em;
  @media (min-width: 750px) {
    letter-spacing: -0.02em;
  }
`;

export type OaksImpactSchoolQuoteProps = {
  title: string;
  image: {
    alt: string;
    src: string;
  };
  subTitle: string;
  quote: {
    quote: string | string[];
    authorName?: string;
    authorTitle?: string;
    authorImageSrc?: string;
  };
};
export function OaksImpactSchoolQuote({
  title,
  image,
  subTitle,
  quote,
}: Readonly<OaksImpactSchoolQuoteProps>) {
  const quoteLines = Array.isArray(quote.quote) ? quote.quote : [quote.quote];

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
                  <OakFlex $width={"100%"}>
                    <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
                      <OakBox $font={"heading-light-6"} $color={"text-primary"}>
                        <TightLetterSpacing
                          $flexDirection={"column"}
                          $gap={"spacing-12"}
                        >
                          {quoteLines.map((quoteLine, quoteLineIndex) => {
                            const isFirst = quoteLineIndex === 0;
                            const isLast =
                              quoteLineIndex === quoteLines.length - 1;
                            return (
                              <OakP key={quoteLine}>
                                {isFirst && "\u201C"}
                                {quoteLine}
                                {isLast && "\u201D"}
                              </OakP>
                            );
                          })}
                        </TightLetterSpacing>
                      </OakBox>

                      {quote.authorName ? (
                        <OakFlex $gap={"spacing-16"} $alignItems={"center"}>
                          {quote.authorImageSrc ? (
                            <StyledAuthorImage
                              alt={""}
                              role={"presentation"}
                              src={quote.authorImageSrc}
                            />
                          ) : null}
                          <OakFlex $flexDirection={"column"}>
                            <OakP $font={"body-2-bold"} $color={"text-primary"}>
                              {quote.authorName}
                            </OakP>
                            {quote.authorTitle ? (
                              <OakP $font={"body-2"} $color={"text-primary"}>
                                {quote.authorTitle}
                              </OakP>
                            ) : null}
                          </OakFlex>
                        </OakFlex>
                      ) : null}
                    </OakFlex>
                  </OakFlex>
                </OakFlex>
              </OakFlex>
            </OakFlex>
          </OakFlex>
        </OakFlex>
      </OakFlex>
    </OakFlex>
  );
}
