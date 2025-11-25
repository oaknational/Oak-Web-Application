import {
  OakFlex,
  OakImage,
  OakP,
  OakHeading,
  OakSecondaryButton,
  OakGrid,
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
  @media (max-width: 1279px) {
    & img:nth-child(2) {
      order: -1;
      max-height: 40px;
    }
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
        <OakGrid
          $rg={["spacing-40", "spacing-40", "spacing-16"]}
          $cg="spacing-16"
        >
          <OakGridArea
            $colSpan={[12, 12, 4]}
            $colStart={[1, 1, 1]}
            $justifyContent={["flex-start", "center", "center"]}
          >
            <OakFlex
              $flexDirection="column"
              $gap={"spacing-32"}
              data-id-hi={"hi"}
            >
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

              <OakFlex
                $flexDirection={["column", "row", "row"]}
                $gap="spacing-16"
              >
                <OakSecondaryButton
                  iconName="external"
                  isTrailingIcon={true}
                  href={permanentRolesLink}
                  element="a"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Permanent roles
                </OakSecondaryButton>
                <OakSecondaryButton
                  iconName="external"
                  isTrailingIcon={true}
                  href={freelanceRolesLink}
                  element="a"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Freelance roles
                </OakSecondaryButton>
              </OakFlex>
            </OakFlex>
          </OakGridArea>

          <OakGridArea $colSpan={[12, 12, 7]} $colStart={[1, 1, 6]}>
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
          </OakGridArea>
        </OakGrid>
      </OakFlex>
    </InnerMaxWidth>
  );
}
