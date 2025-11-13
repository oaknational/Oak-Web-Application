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

function InnerMaxWidth({ children }: { children: ReactNode }) {
  const styleAttrs = useMemo(() => ({ maxWidth: 1280 + 40 * 2 }), []);
  return (
    <OakBox
      style={styleAttrs}
      $mh={"auto"}
      $ph={["inner-padding-m", "inner-padding-m", "inner-padding-xl3"]}
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
          $gap={["all-spacing-8", "all-spacing-10"]}
          $pt={["inner-padding-xl5", "inner-padding-xl8"]}
        >
          <OakGrid $cg="space-between-s" $rg="space-between-s">
            <OakGridArea $colSpan={[12, 12, 9]} $colStart={[0, 0, 3]}>
              <OakFlex $gap={"all-spacing-2"} $flexDirection={"column"}>
                <OakBox $font={["heading-6", "heading-5"]}>
                  <OakSpan $background={"mint"} $ph={"inner-padding-ssx"}>
                    {subtitle}
                  </OakSpan>
                </OakBox>
                <OakHeading tag="h2" $font={["heading-5", "heading-3"]}>
                  {title}
                </OakHeading>
              </OakFlex>
            </OakGridArea>
          </OakGrid>
          <OakGrid $cg="space-between-s" $rg="space-between-s">
            <OakGridArea $colSpan={[12, 12, 8]} $colStart={[0, 0, 4]}>
              <OakFlex $flexDirection={"column"}>
                {items.map((item, itemIndex) => {
                  const isLast = items.length - 1 === itemIndex;
                  return (
                    <TimelineItemFlex
                      key={item.title}
                      data-testid="timetable-timeline-item"
                      $gap={"all-spacing-4"}
                    >
                      <OakFlex
                        $width={"all-spacing-6"}
                        $flexShrink={0}
                        $flexDirection={"column"}
                        $alignItems={"center"}
                      >
                        <OakFlex
                          $background={"bg-decorative1-main"}
                          $borderColor={"border-decorative1-stronger"}
                          $borderStyle={"solid"}
                          $ba={"border-solid-m"}
                          $width={"all-spacing-6"}
                          $height={"all-spacing-6"}
                          $borderRadius={"border-radius-circle"}
                          $flexGrow={0}
                        />
                        <OakFlex
                          $borderColor={"border-decorative1-stronger"}
                          $borderStyle={isLast ? "dashed" : "solid"}
                          $ba={"border-solid-none"}
                          $bl={"border-solid-l"}
                          $width={"space-between-none"}
                          $flexGrow={1}
                        />
                      </OakFlex>
                      <OakFlex
                        $flexDirection={"column"}
                        $gap={"all-spacing-2"}
                        $mb={["space-between-xl", "space-between-xxl"]}
                      >
                        <OakBox $font={["heading-7"]}>
                          <OakSpan
                            $ph={"inner-padding-ssx"}
                            $background={"mint"}
                          >
                            {item.subtitle}
                          </OakSpan>
                        </OakBox>
                        <OakHeading tag="h3" $font={["heading-6", "heading-5"]}>
                          {item.title}
                        </OakHeading>
                        <OakBox>
                          {item.text.map((textItem) => {
                            return (
                              <OakP key={textItem} $font={"body-1"}>
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
