import { PropsWithChildren, ReactNode } from "react";

import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakMaxWidth,
} from "@oaknational/oak-components";

type RegistrationLayoutProps = PropsWithChildren<{
  asideSlot: ReactNode;
  termsSlot?: ReactNode;
  bannerSlot?: ReactNode;
  // A/B testing an alternate layout for registration pages
  useAlternateLayout: boolean;
}>;

const RegistrationLayout = ({
  children,
  asideSlot,
  termsSlot,
  bannerSlot,
  useAlternateLayout,
}: RegistrationLayoutProps) => {
  return useAlternateLayout ? (
    <OakGrid $width="100%" $height="100%">
      <OakGridArea
        $colSpan={6}
        $pa="inner-padding-xl2"
        $background="bg-decorative1-main"
        $justifyContent="center"
        $alignItems="center"
      >
        <OakFlex
          $flexDirection="column"
          $alignItems="flex-start"
          $gap="space-between-l"
        >
          {asideSlot}
          {bannerSlot}
        </OakFlex>
      </OakGridArea>
      <OakGridArea
        $colSpan={6}
        $pa="inner-padding-xl2"
        $background="white"
        $alignItems="center"
        $justifyContent="center"
      >
        <OakFlex
          style={{ width: "400px" }}
          $flexDirection="column"
          $gap="space-between-m"
        >
          {children}
          {termsSlot}
        </OakFlex>
      </OakGridArea>
    </OakGrid>
  ) : (
    <OakFlex
      $background={["white", "bg-decorative1-main"]}
      $overflow="auto"
      $color="black"
    >
      <OakMaxWidth
        $justifyContent={"center"}
        $minHeight={"100vh"}
        $alignItems={["flex-start", "center"]}
        $flexDirection="row"
        $pv={["inner-padding-none", "inner-padding-xl3"]}
      >
        <OakFlex
          $display={["none", "none", "flex"]}
          $flexGrow={1}
          $justifyContent="flex-end"
          $order={2}
        >
          {asideSlot}
        </OakFlex>
        <OakFlex $display="block" $order={1} style={{ width: "400px" }}>
          <OakFlex
            $flexDirection="column"
            $alignItems="center"
            $gap="space-between-m"
            $display={["flex", "block"]}
          >
            {bannerSlot}
            <OakBox
              $dropShadow={[null, "drop-shadow-standard"]}
              $borderRadius="border-radius-m2"
              $width={["auto", "max-content"]}
              $mb={["space-between-none", "space-between-m"]}
            >
              {children}
            </OakBox>
            {termsSlot}
          </OakFlex>
        </OakFlex>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default RegistrationLayout;
