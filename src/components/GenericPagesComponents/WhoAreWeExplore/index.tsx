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

export function WhoAreWeExplore() {
  const items: {
    iconName: OakIconProps["iconName"];
    title: string;
  }[] = [
    {
      iconName: "curriculum-plan",
      title: "About Oak’s curriculum",
    },
    {
      iconName: "ai-worksheet",
      title: "Oak’s impact",
    },
    {
      iconName: "ai-worksheet",
      title: "Meet the team",
    },
    {
      iconName: "ai-worksheet",
      title: "Get involved",
    },
  ] as const;

  return (
    <OakBox $background={"mint"}>
      <InnerMaxWidth>
        <OakFlex
          $flexDirection={"column"}
          $mv="space-between-xxxl"
          $gap={"all-spacing-10"}
        >
          <OakHeading tag="h3" $textAlign={"center"} $font={"heading-4"}>
            Explore more about Oak
          </OakHeading>
          <OakGrid
            $rg={"all-spacing-4"}
            $cg={"all-spacing-4"}
            $gridAutoRows={"1fr"}
          >
            {items.map(({ title, iconName }) => {
              return (
                <OakGridArea $colSpan={[12, 6, 6]}>
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
