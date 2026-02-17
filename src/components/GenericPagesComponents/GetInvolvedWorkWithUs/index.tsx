import {
  OakFlex,
  OakImage,
  OakHeading,
  OakSecondaryButton,
  OakGrid,
  OakIcon,
  OakGridArea,
  OakP,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { PortableTextBlockComponent } from "@portabletext/react";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const BadgeImage = styled.img`
  max-height: 40px;
  height: auto;
  width: auto;
  object-fit: contain;

  @media (min-width: 750px) {
    max-height: 56px;
  }

  @media (min-width: 1280px) {
    max-height: 64px;
  }
`;

const OakPStyled: PortableTextBlockComponent = (props) => {
  return <OakP $font={["body-2", "body-1"]}>{props.children}</OakP>;
};

export type GetInvolvedWorkWithUsProps = {
  heading: string;
  text: PortableTextJSON;
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
    <NewGutterMaxWidth>
      <OakGrid
        $rg={["spacing-40", "spacing-40", "spacing-16"]}
        $cg={["spacing-0", "spacing-40", "spacing-16"]}
        $pv={["spacing-56", "spacing-80"]}
      >
        <OakGridArea
          $colSpan={[12, 6, 4]}
          $colStart={[1, 1, 1]}
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
                <PortableTextWithDefaults
                  value={text}
                  components={{
                    block: {
                      normal: OakPStyled,
                    },
                  }}
                />
              </OakFlex>
            </OakFlex>

            <OakFlex $flexDirection="row" $flexWrap="wrap" $gap="spacing-16">
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
            </OakFlex>
          </OakFlex>
        </OakGridArea>

        <OakGridArea
          $colSpan={[12, 6, 7]}
          $colStart={[1, 7, 6]}
          $justifyContent={"center"}
        >
          <OakFlex
            $flexDirection="column"
            $gap={["spacing-24", "spacing-24", "spacing-32"]}
          >
            <OakFlex $aspectRatio={"16/9"} $width="100%">
              <OakImage
                $objectFit={"cover"}
                alt={imageAlt}
                src={imageUrl}
                sizes="(max-width: 750px) 100vw, (max-width: 1280px) 50vw, 58vw"
              />
            </OakFlex>
            <OakFlex
              $flexDirection={["column", "column", "row"]}
              $rowGap="spacing-24"
              $alignItems="center"
              $justifyContent="space-between"
            >
              {badges.map((badge) => (
                <BadgeImage key={badge.url} alt={badge.alt} src={badge.url} />
              ))}
            </OakFlex>
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </NewGutterMaxWidth>
  );
}
