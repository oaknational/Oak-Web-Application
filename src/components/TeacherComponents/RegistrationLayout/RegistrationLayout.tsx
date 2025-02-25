import { OakBox, OakFlex, OakMaxWidth } from "@oaknational/oak-components";
import { PropsWithChildren, ReactNode } from "react";

type RegistrationLayoutProps = PropsWithChildren<{
  asideSlot: ReactNode;
  termsSlot: ReactNode;
  bannerSlot?: ReactNode;
}>;

export const RegistrationLayout = ({
  children,
  asideSlot,
  termsSlot,
  bannerSlot,
}: RegistrationLayoutProps) => {
  return (
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
