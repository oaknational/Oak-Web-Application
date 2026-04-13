import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakP,
  OakBoxProps,
} from "@oaknational/oak-components";
import { useMemo } from "react";
import styled from "styled-components";
import { PortableTextBlockComponent } from "@portabletext/react";

import { ImageWithAltText } from "@/node-lib/sanity-graphql/generated/sdk";
import CMSImage from "@/components/SharedComponents/CMSImage";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const OakPStyled: PortableTextBlockComponent = (props) => {
  return <OakP $font={["body-2", "body-1"]}>{props.children}</OakP>;
};

const CustomWeAreItemOakGridArea = styled(OakGridArea)`
  grid-column: span 3;

  @media (max-width: 1040px) {
    grid-column: span 6;
  }

  @media (max-width: 749px) {
    grid-column: span 12;
  }
`;

const COLORS: OakBoxProps["$background"][] = [
  "bg-decorative3-main",
  "bg-decorative4-main",
  "bg-decorative2-main",
  "bg-decorative5-main",
] as const;

type WhoAreWeDescProps = {
  title: string;
  items: {
    heading: string;
    textRaw: PortableTextJSON;
    image: ImageWithAltText;
  }[];
};
export function WhoAreWeDesc({ title, items }: Readonly<WhoAreWeDescProps>) {
  const itemsMapped = useMemo(() => {
    return items.map((item, itemIndex) => {
      return {
        ...item,
        background: COLORS[itemIndex % COLORS.length],
      };
    });
  }, [items]);

  return (
    <NewGutterMaxWidth>
      <OakFlex
        $flexDirection={"column"}
        $pv={["spacing-56", "spacing-80", "spacing-80"]}
        $gap={["spacing-32", "spacing-56", "spacing-56"]}
      >
        <OakHeading
          tag="h2"
          $textAlign={["left", "center", "center"]}
          $font={["heading-5", "heading-3", "heading-3"]}
        >
          {title}
        </OakHeading>
        <OakGrid $rg={"spacing-32"} $cg={"spacing-16"}>
          {itemsMapped.map(({ background, heading, textRaw, image }) => {
            return (
              <CustomWeAreItemOakGridArea
                key={heading}
                data-testid="who-we-are-desc-item"
                $colSpan={12}
              >
                <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
                  <OakBox
                    $height={"spacing-240"}
                    $background={background}
                    $borderRadius={"border-radius-m2"}
                    $pa={"spacing-24"}
                  >
                    {image.asset?.url && (
                      <CMSImage
                        $objectFit={"contain"}
                        image={image}
                        $height={"100%"}
                      />
                    )}
                  </OakBox>
                  <OakFlex $gap={"spacing-16"} $flexDirection={"column"}>
                    <OakHeading
                      tag="h3"
                      $font={["heading-6", "heading-5", "heading-5"]}
                    >
                      {heading}
                    </OakHeading>
                    <PortableTextWithDefaults
                      value={textRaw}
                      components={{
                        block: {
                          normal: OakPStyled,
                        },
                      }}
                    />
                  </OakFlex>
                </OakFlex>
              </CustomWeAreItemOakGridArea>
            );
          })}
        </OakGrid>
      </OakFlex>
    </NewGutterMaxWidth>
  );
}
