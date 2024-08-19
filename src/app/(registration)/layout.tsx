"use client";
import CMSImage from "@/components/SharedComponents/CMSImage";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { getIllustrationAsset } from "@/image-data";
import { OakBox, OakFlex, OakMaxWidth } from "@/styles/oakThemeApp";

function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <OakBox $background={["white", "bg-decorative1-main"]} $overflow="hidden">
      <OakMaxWidth
        $justifyContent="center"
        $alignItems={["center", "initial"]}
        $height="100vh"
      >
        <CMSImage
          image={getIllustrationAsset("auth-acorn")}
          $position="fixed"
          $display={["none", "block"]}
          $height="55%"
          $width="auto"
          $right={200}
        />
        <OakFlex $pl={["inner-padding-none", "inner-padding-xl8"]}>
          <OakBox
            $dropShadow="drop-shadow-standard"
            $borderRadius="border-radius-l"
            $display={["none", "block"]}
          >
            {children}
          </OakBox>
          <OakBox $display={["block", "none"]}>{children}</OakBox>
        </OakFlex>
      </OakMaxWidth>
    </OakBox>
  );
}

const RegistrationLayoutWithFF = withFeatureFlag(
  RegistrationLayout,
  "use-auth-owa",
);

export default RegistrationLayoutWithFF;
