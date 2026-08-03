import styled from "styled-components";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";
import z from "zod";

import { oaksImpactSchoolQuoteCardSchema } from "@/common-lib/cms-types";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const StyledAuthorImage = styled(OakImage)`
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  img {
    border-radius: 50%;
  }
`;

const TightLetterSpacing = styled(OakFlex)`
  letter-spacing: -0.01em;
  @media (min-width: 750px) {
    letter-spacing: -0.02em;
  }
`;

export type OaksImpactSchoolQuoteProps = {
  as?: "div" | "li";
} & z.infer<typeof oaksImpactSchoolQuoteCardSchema>;

export function OaksImpactSchoolQuote({
  as = "div",
  logo,
  summary,
  quote,
  headshot,
}: Readonly<OaksImpactSchoolQuoteProps>) {
  const quoteLines = quote.text.split("\n").filter(Boolean);
  const { attribution: authorName, role, organisation } = quote;

  return (
    <OakFlex
      as={as}
      $flexDirection={"column"}
      $background={"bg-neutral"}
      $ba="border-solid-m"
      $borderColor="border-neutral-lighter"
      $borderRadius={"border-radius-l"}
      $overflow="hidden"
      $flexGrow={1}
    >
      <OakImage
        src={getProxiedSanityAssetUrl(logo.asset?.url ?? "")}
        alt={logo.altText ?? ""}
        $aspectRatio={"16/9"}
      />
      <OakFlex
        $flexDirection={"column"}
        $ph={"spacing-24"}
        $pv={"spacing-32"}
        $gap={"spacing-32"}
      >
        <OakFlex $flexDirection={"column"} $gap={"spacing-8"}>
          <OakHeading tag={"h3"} $color={"text-primary"} $font={"heading-5"}>
            {organisation}
          </OakHeading>
          <OakP $color={"text-primary"} $font={"body-2"}>
            {summary}
          </OakP>
        </OakFlex>
        <OakBox $height="spacing-2" style={{ background: "#D9D9D9" }} />
        <OakFlex $flexDirection={"column"}>
          <OakFlex $flexDirection={"column"}>
            <OakFlex $flexDirection={"column"}>
              <OakFlex $alignItems={"flex-start"}>
                <OakFlex $flexDirection={"column"} $gap={"spacing-40"}>
                  <OakFlex $width={"100%"}>
                    <OakFlex $flexDirection={"column"} $gap={"spacing-20"}>
                      <OakBox $font={"heading-light-6"} $color={"text-primary"}>
                        <TightLetterSpacing
                          $flexDirection={"column"}
                          $gap={"spacing-20"}
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
                      <OakFlex
                        $gap={"spacing-16"}
                        $alignItems={["top", "center"]}
                      >
                        <StyledAuthorImage
                          src={getProxiedSanityAssetUrl(
                            headshot.asset?.url ?? "",
                          )}
                          alt={headshot.altText ?? ""}
                        />
                        <OakFlex $flexDirection={"column"}>
                          <OakP $font={"body-2-bold"} $color={"text-primary"}>
                            {authorName}
                          </OakP>
                          <OakP $font={"body-2"} $color={"text-primary"}>
                            {role}, {organisation}
                          </OakP>
                        </OakFlex>
                      </OakFlex>
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
