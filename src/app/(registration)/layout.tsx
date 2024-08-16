import CMSImage from "@/components/SharedComponents/CMSImage";
import { getIllustrationAsset } from "@/image-data";
import { OakBox, OakFlex, OakMaxWidth } from "@/styles/oakThemeApp";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OakBox $background={["white", "bg-decorative1-main"]} $overflow="hidden">
      <OakMaxWidth
        $justifyContent="center"
        $alignItems={["center", "initial"]}
        $height="100vh"
      >
        <CMSImage
          image={getIllustrationAsset("auth0-background")}
          $position="fixed"
          $width="auto"
          $height="100%"
          $right={0}
          $display={["none", "block"]}
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
