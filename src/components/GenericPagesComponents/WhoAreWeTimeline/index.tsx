import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakBox,
  OakP,
  OakSpan,
} from "@oaknational/oak-components";
import { ReactNode, useMemo } from "react";

function InnerMaxWidth({ children }: { children: ReactNode }) {
  const styleAttrs = useMemo(() => ({ maxWidth: 1280 + 40 * 2 }), []);
  return (
    <OakBox
      style={styleAttrs}
      $mh={"auto"}
      $ph={["inner-padding-m", "inner-padding-xl3", "inner-padding-xl3"]}
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
          $gap={"all-spacing-10"}
          $pt={"inner-padding-xl7"}
        >
          <OakGrid $cg="space-between-s" $rg="space-between-s">
            <OakGridArea $colSpan={[12, 12, 8]} $colStart={[0, 0, 3]}>
              <OakFlex $gap={"all-spacing-2"} $flexDirection={"column"}>
                <OakBox $font={"heading-5"}>
                  <OakSpan $background={"mint"} $ph={"inner-padding-ssx"}>
                    {title}
                  </OakSpan>
                </OakBox>
                <OakBox $font={"heading-3"}>{subtitle}</OakBox>
              </OakFlex>
            </OakGridArea>
          </OakGrid>
          <OakGrid $cg="space-between-s" $rg="space-between-s">
            <OakGridArea $colSpan={[12, 12, 12]} $colStart={[0, 2, 2]}>
              <OakFlex $flexDirection={"column"}>
                {items.map((item, itemIndex) => {
                  const isLast = items.length - 1 === itemIndex;
                  return (
                    <OakFlex key={item.title} $gap={"all-spacing-4"}>
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
                        $mb={"space-between-xxl"}
                      >
                        <OakBox $font={"body-2-bold"}>
                          <OakSpan
                            $ph={"inner-padding-ssx"}
                            $background={"mint"}
                          >
                            {item.subtitle}
                          </OakSpan>
                        </OakBox>
                        <OakBox $font={"heading-light-5"}>{item.title}</OakBox>
                        <OakBox>
                          {item.text.map((textItem) => {
                            return <OakP key={textItem}>{textItem}</OakP>;
                          })}
                        </OakBox>
                      </OakFlex>
                    </OakFlex>
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
