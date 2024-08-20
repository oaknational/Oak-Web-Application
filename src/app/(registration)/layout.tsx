"use client";
import CMSImage from "@/components/SharedComponents/CMSImage";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { getIllustrationAsset } from "@/image-data";
import { OakBox, OakFlex } from "@/styles/oakThemeApp";

function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <OakFlex
      $height="100vh"
      $background={["white", "bg-decorative1-main"]}
      $alignItems="center"
      $justifyContent={["center", "flex-start"]}
    >
      <CMSImage
        image={getIllustrationAsset("auth-acorn")}
        $position="fixed"
        $display={["none", "block"]}
        $height="55%"
        $width="auto"
        $right={200}
      />
      <OakBox
        $dropShadow="drop-shadow-standard"
        $borderRadius="border-radius-l"
        $display={["none", "block"]}
        $width="max-content"
        $ml="space-between-xxxl"
      >
        {children}
      </OakBox>
      <OakBox $display={["block", "none"]}>{children}</OakBox>
    </OakFlex>
  );
}

const RegistrationLayoutWithFF = withFeatureFlag(
  RegistrationLayout,
  "use-auth-owa",
);

export default RegistrationLayoutWithFF;
