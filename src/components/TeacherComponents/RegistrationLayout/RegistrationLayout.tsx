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
        $pa="spacing-32"
        $background="bg-decorative1-main"
        $justifyContent="center"
        $alignItems="center"
      >
        <OakFlex
          $flexDirection="column"
          $alignItems="flex-start"
          $gap="spacing-48"
        >
          {asideSlot}
          {bannerSlot}
        </OakFlex>
      </OakGridArea>
      <OakGridArea
        $colSpan={[12, 12, 6]}
        $pa="spacing-32"
        $background="white"
        $alignItems="center"
        $justifyContent="center"
      >
        <OakFlex
          style={{ width: "400px" }}
          $flexDirection="column"
          $gap={["spacing-0", "spacing-0", "spacing-24"]}
        >
          <OakBox
            $display={["block", "block", "none"]}
            $width="max-content"
            $ph="spacing-40"
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
