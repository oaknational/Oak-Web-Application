import {
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
  OakUiRoleToken,
} from "@oaknational/oak-components";
import styled from "styled-components";

import CurricQuote from "@/components/CurriculumComponents/CurricQuote";
import Cover from "@/components/SharedComponents/Cover";

const StyledResponsiveFlex = styled(OakFlex)`
  flex-direction: column;

  @media (min-width: 1000px) {
    flex-direction: row;
  }
`;

export type GuidingPrincipleItem = {
  heading: string;
  text: string;
};

export type GuidingPrinciplesProps = {
  accentColor: OakUiRoleToken;
  $background: OakUiRoleToken;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  principles?: GuidingPrincipleItem[];
};
export function GuidingPrinciples({
  accentColor,
  $background,
  title = "Our guiding principles",
  subtitle = "We have crafted a set of overarching principles that describe the features important to our curricula in all subjects.",
  imageUrl,
  imageAlt = "",
  principles,
}: Readonly<GuidingPrinciplesProps>) {
  if (!principles || principles.length === 0) {
    return null;
  }

  return (
    <StyledResponsiveFlex
      $justifyContent="space-between"
      $alignItems="flex-start"
      $background={$background}
      $borderRadius="border-radius-l"
      $pa={["spacing-24", "spacing-64", "spacing-80"]}
      $gap={["spacing-56", "spacing-80", "spacing-72"]}
    >
      <OakFlex
        $alignItems={["center", "center", "flex-start"]}
        $flexDirection="column"
        $flexGrow={1}
        $flexBasis={0}
        $gap={["spacing-64"]}
      >
        <OakFlex $flexDirection="column">
          <OakHeading tag="h2" $font={["heading-4", "heading-3"]}>
            {title}
          </OakHeading>

          <OakP $mt={"spacing-16"} $mb={"spacing-12"} $font={"body-1"}>
            {subtitle}
          </OakP>
        </OakFlex>

        <Cover
          $width={[300, 450, 450]}
          $height={[270, 420, 420]}
          $position={"relative"}
        >
          {imageUrl ? (
            <OakImage
              src={imageUrl}
              alt={imageAlt}
              $objectFit="contain"
              objectPosition="center"
              $height="100%"
              $width="100%"
            />
          ) : (
            <OakImage
              src="/images/illustrations/curriculum-approach.svg"
              alt=""
              $objectFit="contain"
              objectPosition="center"
              $height="100%"
              $width="100%"
            />
          )}
        </Cover>
      </OakFlex>

      <OakFlex
        $flexDirection="column"
        $gap={"spacing-48"}
        $flexGrow={[null, 1]}
        $flexBasis={[null, 0]}
        $pb={["spacing-16", "spacing-0"]}
      >
        {principles.map((principle) => (
          <CurricQuote
            key={principle.heading}
            title={principle.heading}
            barColor={accentColor}
          >
            {principle.text}
          </CurricQuote>
        ))}
      </OakFlex>
    </StyledResponsiveFlex>
  );
}
