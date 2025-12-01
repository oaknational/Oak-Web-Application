import {
  OakFlex,
  OakImage,
  OakP,
  OakHeading,
  OakSecondaryButton,
  OakGrid,
  OakIcon,
  OakGridArea,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { InnerMaxWidth } from "../InnerMaxWidth";

const BadgeImage = styled.img`
  max-height: 56px;
  height: auto;
  width: auto;
  object-fit: contain;

  @media (min-width: 1280px) {
    max-height: 74px;
  }
`;

const BadgeWrapper = styled(OakFlex)`
  @media (max-width: 1027px) {
    max-height: 40px;
  }
`;

const ResponsiveGrid = styled(OakGrid)`
  @media (min-width: 1028px) {
    grid-template-columns: repeat(12, 1fr);
  }
`;

const ResponsiveGridAreaLeft = styled(OakGridArea)`
  @media (min-width: 1028px) {
    grid-column: 1 / span 4;
  }
`;

const ResponsiveGridAreaRight = styled(OakGridArea)`
  @media (min-width: 1028px) {
    grid-column: 6 / span 7;
  }
`;

const ButtonContainer = styled(OakFlex)`
  @media (min-width: 1028px) and (max-width: 1279px) {
    flex-direction: column;
  }
`;

export type GetInvolvedWorkWithUsProps = {
  heading: string;
  text: string[];
  permanentRolesLink: string;
  freelanceRolesLink: string;
  imageUrl: string;
  imageAlt: string;
  badges: Array<{
    url: string;
    alt: string;
  }>;
};

export function GetInvolvedWorkWithUs({
  heading,
  text,
  permanentRolesLink,
  freelanceRolesLink,
  imageUrl,
  imageAlt,
  badges,
}: Readonly<GetInvolvedWorkWithUsProps>) {
  return (
    <InnerMaxWidth>
      <OakFlex $flexDirection="column" $pv={["spacing-56", "spacing-80"]}>
        <ResponsiveGrid
          $rg={["spacing-40", "spacing-40", "spacing-16"]}
          $cg="spacing-16"
        >
          <ResponsiveGridAreaLeft
            $colSpan={[12, 12]}
            $colStart={[1, 1]}
            $justifyContent={["flex-start", "center", "center"]}
          >
            <OakFlex $flexDirection="column" $gap={"spacing-32"}>
              <OakFlex $flexDirection="column" $gap="spacing-24">
                <OakHeading
                  $font={["heading-5", "heading-3", "heading-3"]}
                  $color="text-primary"
                  tag="h2"
                >
                  {heading}
                </OakHeading>
                <OakFlex
                  $font={["body-2", "body-1", "body-1"]}
                  $flexDirection={"column"}
                  $gap={["spacing-20", "spacing-24"]}
                >
                  {text.map((textItem) => {
                    return (
                      <OakP key={textItem} $color="text-primary">
                        {textItem}
                      </OakP>
                    );
                  })}
                </OakFlex>
              </OakFlex>

              <ButtonContainer
                $flexDirection={["column", "row", "row"]}
                $gap="spacing-16"
              >
                <OakSecondaryButton
                  iconOverride={
                    <OakIcon
                      iconName="external"
                      alt="external"
                      $width="spacing-24"
                      $height="spacing-24"
                    />
                  }
                  isTrailingIcon={true}
                  href={permanentRolesLink}
                  element="a"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Permanent roles
                </OakSecondaryButton>
                <OakSecondaryButton
                  iconOverride={
                    <OakIcon
                      iconName="external"
                      alt="external"
                      $width="spacing-24"
                      $height="spacing-24"
                    />
                  }
                  isTrailingIcon={true}
                  href={freelanceRolesLink}
                  element="a"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Freelance roles
                </OakSecondaryButton>
              </ButtonContainer>
            </OakFlex>
          </ResponsiveGridAreaLeft>

          <ResponsiveGridAreaRight $colSpan={[12, 12]} $colStart={[1, 1]}>
            <OakFlex
              $flexDirection="column"
              $gap={["spacing-24", "spacing-32"]}
            >
              <OakFlex $aspectRatio={"16/9"} $width="100%">
                <OakImage $objectFit={"cover"} alt={imageAlt} src={imageUrl} />
              </OakFlex>
              <BadgeWrapper
                $flexDirection={["column", "column", "row"]}
                $rowGap="spacing-24"
                $alignItems="center"
                $justifyContent="space-between"
              >
                {badges.map((badge) => (
                  <BadgeImage key={badge.url} alt={badge.alt} src={badge.url} />
                ))}
              </BadgeWrapper>
            </OakFlex>
          </ResponsiveGridAreaRight>
        </ResponsiveGrid>
      </OakFlex>
    </InnerMaxWidth>
  );
}
