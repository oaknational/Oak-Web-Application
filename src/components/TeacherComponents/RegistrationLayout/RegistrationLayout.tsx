import { PropsWithChildren, ReactNode } from "react";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";

type RegistrationLayoutProps = PropsWithChildren<{
  asideSlot: ReactNode;
  termsSlot?: ReactNode;
  bannerSlot?: ReactNode;
}>;

const RegistrationLayout = ({
  children,
  asideSlot,
  termsSlot,
  bannerSlot,
}: RegistrationLayoutProps) => {
  return (
    <OakGrid $width="100%" $height="100%">
      <OakGridArea
        $colSpan={[0, 0, 6]}
        $display={["none", "none", "flex"]}
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
        $colSpan={[12, 12, 6]}
        $pa="inner-padding-xl2"
        $background="white"
        $alignItems="center"
        $justifyContent="center"
      >
        <OakFlex
          style={{ width: "400px" }}
          $flexDirection="column"
          $gap={["all-spacing-0", "all-spacing-0", "space-between-m"]}
        >
          <OakBox
            $display={["block", "block", "none"]}
            $width="max-content"
            $ph="inner-padding-xl3"
          >
            {bannerSlot}
          </OakBox>
          {children}
          {termsSlot}
        </OakFlex>
      </OakGridArea>
    </OakGrid>
  );
};

export default RegistrationLayout;
