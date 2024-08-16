import CMSImage from "@/components/SharedComponents/CMSImage";
import { getIllustrationAsset } from "@/image-data";
import { OakBox, OakFlex, OakMaxWidth } from "@/styles/oakThemeApp";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OakBox $background="bg-decorative1-main" $overflow="hidden">
      <OakMaxWidth $justifyContent={"center"} $height="100vh">
        <CMSImage
          image={getIllustrationAsset("auth0-background")}
          $position="fixed"
          $width="auto"
          $height="100%"
          $right={0}
          $display={["none", "none", "block"]}
        />
        <OakFlex
          $pl={[
            "inner-padding-none",
            "inner-padding-none",
            "inner-padding-xl8",
          ]}
        >
          {children}
        </OakFlex>
      </OakMaxWidth>
    </OakBox>
  );
}
