import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakIcon,
  OakIconProps,
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

export type WhoAreWeExploreProps = {
  title: string;
  items: {
    iconName: OakIconProps["iconName"];
    title: string;
    href: string;
  }[];
};
export function WhoAreWeExplore({
  title,
  items,
}: Readonly<WhoAreWeExploreProps>) {
  return (
    <OakBox $background={"mint"}>
      <InnerMaxWidth>
        <OakFlex
          $flexDirection={"column"}
          $mv="space-between-xxxl"
          $gap={"all-spacing-10"}
        >
          <OakHeading tag="h3" $textAlign={"center"} $font={"heading-4"}>
            {title}
          </OakHeading>
          <OakGrid
            $rg={"all-spacing-4"}
            $cg={"all-spacing-4"}
            $gridAutoRows={"1fr"}
          >
            {items.map(({ title, iconName }) => {
              return (
                <OakGridArea key={title} $colSpan={[12, 6, 6]}>
                  <OakFlex
                    $flexDirection={"row"}
                    $pa={"inner-padding-m"}
                    $background={"white"}
                    $gap={"all-spacing-4"}
                    $alignItems={"center"}
                    $borderRadius={"border-radius-m2"}
                  >
                    <OakFlex>
                      <OakIcon iconName={iconName} />
                    </OakFlex>
                    <OakFlex $flexGrow={1} $font={"body-1-bold"}>
                      {title}
                    </OakFlex>
                    <OakFlex>
                      <OakIcon iconName="arrow-right" />
                    </OakFlex>
                  </OakFlex>
                </OakGridArea>
              );
            })}
          </OakGrid>
        </OakFlex>
      </InnerMaxWidth>
    </OakBox>
  );
}
