import {
  OakFlex,
  OakHeading,
  OakBox,
  OakGrid,
  OakGridArea,
  OakImage,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { GetInvolvedLinkCard } from "@/components/GenericPagesComponents/GetInvolvedLinkCard";
import { InnerMaxWidth } from "@/components/GenericPagesComponents/InnerMaxWidth";
import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const StyledImage = styled(OakImage)`
  height: 260px;

  @media (min-width: 750px) {
    height: 380px;
  }

  @media (min-width: 1280px) {
    height: 430px;
  }
`;

export type GetInvolvedCollaborateWithUsProps = {
  heading: string;
  imageUrl: string;
  imageAlt: string;
  cards: Array<{
    headingTag: "h2" | "h3";
    headingTitle: string;
    content: PortableTextJSON;
    buttons: Array<{
      text: string;
      link: string;
      external?: boolean;
    }>;
  }>;
};

export function GetInvolvedCollaborateWithUs({
  heading,
  imageUrl,
  imageAlt,
  cards,
}: Readonly<GetInvolvedCollaborateWithUsProps>) {
  return (
    <OakBox $background={"bg-decorative3-subdued"}>
      <InnerMaxWidth>
        <OakFlex $flexDirection="column" $pv={["spacing-56", "spacing-80"]}>
          <OakGrid
            $gridTemplateColumns={[
              "repeat(4, 1fr)",
              "repeat(8, 1fr)",
              "repeat(12, 1fr)",
            ]}
            $rg={["spacing-40", "spacing-40", "spacing-16"]}
            $cg="spacing-16"
          >
            <OakGridArea
              $colSpan={[4, 4, 5]}
              $colStart={[1, 1, 1]}
              $rowStart={[1, 1, 1]}
            >
              <OakHeading
                $font={["heading-5", "heading-3", "heading-3"]}
                $color="text-primary"
                tag="h2"
              >
                {heading}
              </OakHeading>
            </OakGridArea>

            <OakGridArea
              $colSpan={[2, 3, 3]}
              $colStart={[3, 2, 3]}
              $rowStart={[3, 1, 1]}
              $rowSpan={[1, 1, 1]}
            >
              <OakFlex $height="100%" $alignItems="flex-end">
                <StyledImage alt={imageAlt} src={imageUrl} />
              </OakFlex>
            </OakGridArea>

            <OakGridArea
              $colSpan={[4, 4, 6]}
              $colStart={[1, 5, 7]}
              $rowStart={[2, 1, 1]}
            >
              <OakFlex $flexDirection="column" $gap="spacing-16">
                {cards.map((card) => (
                  <OakBox key={card.headingTitle} $background="white">
                    <GetInvolvedLinkCard
                      headingTag={card.headingTag}
                      headingTitle={card.headingTitle}
                      content={
                        <PortableTextWithDefaults value={card.content} />
                      }
                      buttons={card.buttons}
                    />
                  </OakBox>
                ))}
              </OakFlex>
            </OakGridArea>
          </OakGrid>
        </OakFlex>
      </InnerMaxWidth>
    </OakBox>
  );
}
