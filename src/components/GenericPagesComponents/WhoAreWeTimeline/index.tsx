import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakBox,
  OakSpan,
  OakHeading,
  OakLink,
} from "@oaknational/oak-components";
import { PortableTextMarkComponent } from "@portabletext/react";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

export const SecondaryAnchorLink: PortableTextMarkComponent<{
  _type: "anchor";
  anchor: string;
}> = (props) => {
  return (
    <OakLink href={`#${props.value?.anchor ?? ""}`}>{props.children}</OakLink>
  );
};

export type WhoAreWeTimelineProps = {
  title: string;
  subTitle: string;
  items: {
    title: string;
    subTitle: string;
    text: PortableTextJSON;
  }[];
};
export default function WhoAreWeTimeline({
  title,
  subTitle,
  items,
}: Readonly<WhoAreWeTimelineProps>) {
  return (
    <OakBox $background={"bg-decorative1-very-subdued"}>
      <NewGutterMaxWidth>
        <OakFlex
          $flexDirection={"column"}
          $gap={["spacing-40", "spacing-56"]}
          $pt={["spacing-56", "spacing-72"]}
        >
          <OakGrid $cg="spacing-16" $rg="spacing-16">
            <OakGridArea $colSpan={[12, 12, 9]} $colStart={[0, 0, 2]}>
              <OakFlex $gap={"spacing-8"} $flexDirection={"column"}>
                <OakBox $font={["heading-6", "heading-5"]}>
                  <OakSpan
                    $background={"bg-decorative1-main"}
                    $ph={"spacing-4"}
                  >
                    {subTitle}
                  </OakSpan>
                </OakBox>
                <OakHeading tag="h2" $font={["heading-5", "heading-3"]}>
                  {title}
                </OakHeading>
              </OakFlex>
            </OakGridArea>
          </OakGrid>
          <OakGrid $cg="spacing-16" $rg="spacing-16">
            <OakGridArea $colSpan={[12, 12, 8]} $colStart={[0, 0, 3]}>
              <OakFlex $flexDirection={"column"}>
                {items.map((item, itemIndex) => {
                  const isLast = items.length - 1 === itemIndex;
                  return (
                    <OakFlex
                      key={item.title}
                      data-testid="timetable-timeline-item"
                      $gap={"spacing-16"}
                    >
                      <OakFlex
                        $width={"spacing-24"}
                        $flexShrink={0}
                        $flexDirection={"column"}
                        $alignItems={"center"}
                      >
                        <OakFlex
                          $background={"bg-decorative1-main"}
                          $borderColor={"border-decorative1-stronger"}
                          $borderStyle={"solid"}
                          $ba={"border-solid-m"}
                          $width={"spacing-24"}
                          $height={"spacing-24"}
                          $borderRadius={"border-radius-circle"}
                          $flexGrow={0}
                        />
                        <OakFlex
                          $borderColor={"border-decorative1-stronger"}
                          $borderStyle={isLast ? "dashed" : "solid"}
                          $ba={"border-solid-none"}
                          $bl={"border-solid-l"}
                          $width={"spacing-0"}
                          $flexGrow={1}
                        />
                      </OakFlex>
                      <OakFlex
                        $flexDirection={"column"}
                        $gap={"spacing-8"}
                        $mb={["spacing-56", "spacing-72"]}
                      >
                        <OakBox $font={"heading-7"}>
                          <OakSpan
                            $ph={"spacing-4"}
                            $background={"bg-decorative1-main"}
                          >
                            {item.subTitle}
                          </OakSpan>
                        </OakBox>
                        <OakHeading tag="h3" $font={["heading-6", "heading-5"]}>
                          {item.title}
                        </OakHeading>
                        <OakFlex
                          $font={["body-2", "body-1"]}
                          $flexDirection={"column"}
                          $gap={["spacing-20", "spacing-24"]}
                        >
                          <PortableTextWithDefaults
                            value={item.text}
                            components={{
                              marks: {
                                anchorLink: SecondaryAnchorLink,
                              },
                            }}
                          />
                        </OakFlex>
                      </OakFlex>
                    </OakFlex>
                  );
                })}
              </OakFlex>
            </OakGridArea>
          </OakGrid>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakBox>
  );
}
