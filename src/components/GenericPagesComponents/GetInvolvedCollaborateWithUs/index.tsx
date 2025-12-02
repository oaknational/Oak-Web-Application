import {
  OakFlex,
  OakHeading,
  OakBox,
  OakGrid,
  OakGridArea,
  OakImage,
} from "@oaknational/oak-components";
import { ReactNode } from "react";

import { GetInvolvedLinkCard } from "@/components/GenericPagesComponents/GetInvolvedLinkCard";

function InnerMaxWidth({ children }: { children: ReactNode }) {
  return (
    <OakBox
      $maxWidth={"spacing-1280"}
      $mh={"auto"}
      $ph={["spacing-16", "spacing-16", "spacing-0"]}
    >
      {children}
    </OakBox>
  );
}

export type GetInvolvedCollaborateWithUsProps = {
  heading: string;
  imageUrl: string;
  imageAlt: string;
  cards: Array<{
    headingTag: "h2" | "h3";
    headingTitle: string;
    content: string;
    buttons: Array<{
      text: string;
      link: string;
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
            $rg={["spacing-40", "spacing-40", "spacing-16"]}
            $cg="spacing-16"
          >
            <OakGridArea
              $colSpan={[12, 12, 5]}
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
              $colSpan={[12, 6, 3]}
              $colStart={[1, 1, 4]}
              $rowStart={[3, 2, 1]}
              $rowSpan={[1, 1, 1]}
            >
              <OakFlex $height="100%" $alignItems="flex-end">
                <OakImage
                  alt={imageAlt}
                  src={imageUrl}
                  $height={"spacing-360"}
                />
              </OakFlex>
            </OakGridArea>

            <OakGridArea
              $colSpan={[12, 6, 7]}
              $colStart={[1, 7, 7]}
              $rowStart={[2, 2, 1]}
            >
              <OakFlex $flexDirection="column" $gap="spacing-16">
                {cards.map((card, index) => (
                  <OakBox key={`card-${index}`} $background="white">
                    <GetInvolvedLinkCard
                      headingTag={card.headingTag}
                      headingTitle={card.headingTitle}
                      content={card.content}
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
