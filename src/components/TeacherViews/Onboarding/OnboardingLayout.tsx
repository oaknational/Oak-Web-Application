import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { PropsWithChildren, ReactNode } from "react";

import CMSImage from "@/components/SharedComponents/CMSImage";
import { getIllustrationAsset } from "@/image-data";

type OnboardingLayoutProps = PropsWithChildren<{
  promptHeading: ReactNode;
  promptBody: ReactNode;
}>;

export const OnboardingLayout = ({
  children,
  promptHeading,
  promptBody,
}: OnboardingLayoutProps) => {
  return (
    <OakFlex $background={["white", "bg-decorative1-main"]} $overflow="auto">
      <OakMaxWidth
        $justifyContent={"center"}
        $minHeight={"100vh"}
        $alignItems={["flex-start", "center"]}
        $flexDirection="row"
      >
        <OakFlex
          $display={["none", "none", "flex"]}
          $flexGrow={1}
          $justifyContent="flex-end"
          $order={2}
        >
          <OakBox
            $textAlign="center"
            $width="min-content"
            $minWidth="all-spacing-21"
          >
            <OakFlex $mb="space-between-m" $maxHeight="all-spacing-19">
              <CMSImage
                image={getIllustrationAsset("auth-acorn")}
                $objectFit="contain"
              />
            </OakFlex>
            <OakHeading tag="h1" $font="heading-1" $mb="space-between-m">
              {promptHeading}
            </OakHeading>
            <OakBox $font="body-1">{promptBody}</OakBox>
          </OakBox>
        </OakFlex>
        <OakFlex $display="block" $width="all-spacing-21" $order={1}>
          {children}
        </OakFlex>
      </OakMaxWidth>
    </OakFlex>
  );
};
