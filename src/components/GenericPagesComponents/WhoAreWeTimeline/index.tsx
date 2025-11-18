import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakBox,
  OakP,
  OakSpan,
  OakHeading,
} from "@oaknational/oak-components";
import { ReactNode, useMemo } from "react";
import styled from "styled-components";

const TimelineItemFlex = styled(OakFlex)`
  max-width: 100%;

  @media (min-width: 1280px) {
    max-width: 700px;
  }
`;

function InnerMaxWidth({ children }: Readonly<{ children: ReactNode }>) {
  const styleAttrs = useMemo(() => ({ maxWidth: 1280 + 40 * 2 }), []);
  return (
    <OakBox
      style={styleAttrs}
      $mh={"auto"}
      $ph={["spacing-16", "spacing-16", "spacing-40"]}
    >
      {children}
    </OakBox>
  );
}

export type WhoAreWeTimelineProps = {
  title: string;
  subtitle: string;
  items: {
    title: string;
    subtitle: string;
    text: string[];
  }[];
};
export default function WhoAreWeTimeline({
  title,
  subtitle,
  items,
}: Readonly<WhoAreWeTimelineProps>) {
  return (
    <OakBox $background={"mint30"}>
      <InnerMaxWidth>
        <OakFlex
          $flexDirection={"column"}
          $gap={["spacing-40", "spacing-56"]}
          $pt={["spacing-56", "spacing-80"]}
        >
          <OakGrid $cg="spacing-16" $rg="spacing-16">
            <OakGridArea $colSpan={[12, 12, 9]} $colStart={[0, 0, 3]}>
              <OakFlex $gap={"spacing-8"} $flexDirection={"column"}>
                <OakBox $font={["heading-6", "heading-5"]}>
                  <OakSpan
                    $background={"mint"}
                    $ph={"spacing-4"}
                    $color={"text-primary"}
                  >
                    {subtitle}
                  </OakSpan>
                </OakBox>
                <OakHeading
                  tag="h2"
                  $font={["heading-5", "heading-3"]}
                  $color={"text-primary"}
                >
                  {title}
                </OakHeading>
              </OakFlex>
            </OakGridArea>
          </OakGrid>
          <OakGrid $cg="spacing-16" $rg="spacing-16">
            <OakGridArea $colSpan={[12, 12, 8]} $colStart={[0, 0, 4]}>
              <OakFlex $flexDirection={"column"}>
                {items.map((item, itemIndex) => {
                  const isLast = items.length - 1 === itemIndex;
                  return (
                    <TimelineItemFlex
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
                        <OakBox $font={["heading-7"]}>
                          <OakSpan
                            $ph={"spacing-4"}
                            $background={"mint"}
                            $color={"text-primary"}
                          >
                            {item.subtitle}
                          </OakSpan>
                        </OakBox>
                        <OakHeading
                          tag="h3"
                          $font={["heading-6", "heading-5"]}
                          $color={"text-primary"}
                        >
                          {item.title}
                        </OakHeading>
                        <OakBox>
                          {item.text.map((textItem) => {
                            return (
                              <OakP
                                key={textItem}
                                $font={"body-1"}
                                $color={"text-primary"}
                              >
                                {textItem}
                              </OakP>
                            );
                          })}
                        </OakBox>
                      </OakFlex>
                    </TimelineItemFlex>
                  );
                })}
              </OakFlex>
            </OakGridArea>
          </OakGrid>
        </OakFlex>
      </InnerMaxWidth>
    </OakBox>
  );
}
