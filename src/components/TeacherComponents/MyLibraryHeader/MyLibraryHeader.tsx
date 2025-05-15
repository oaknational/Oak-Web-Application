import {
  OakFlex,
  OakHeading,
  OakImage,
  OakP,
} from "@oaknational/oak-components";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

export default function MyLibraryHeader() {
  return (
    <OakFlex
      $borderRadius={["border-radius-square", "border-radius-xl"]}
      $background="bg-decorative1-main"
    >
      <OakFlex
        $flexDirection="column"
        $justifyContent="center"
        $gap="space-between-s"
        $pa={["inner-padding-m", "inner-padding-xl4"]}
        $pv={["inner-padding-xl", "inner-padding-xl4"]}
      >
        <OakFlex $justifyContent={"space-between"} $alignItems={"baseline"}>
          <OakHeading tag="h1" $font={["heading-4", "heading-1"]}>
            My library
          </OakHeading>
          <OakImage
            $display={["block", "none"]}
            $height={"all-spacing-15"}
            $width={"all-spacing-15"}
            alt="a woman reading a book"
            src={getCloudinaryImageUrl(
              "v1747129947/svg-illustrations/reading_fiction_e43vpo.svg",
            )}
          />
        </OakFlex>
        <OakP $font="body-1">
          All your content in one handy place. Whether it's units you're
          teaching this term, or ideas and inspiration for curriculum
          development and lesson planning. Save what you need to your library.
        </OakP>
      </OakFlex>
      <OakFlex
        $pr="inner-padding-xl4"
        $pt="inner-padding-xl4"
        $display={["none", "block"]}
      >
        <OakImage
          $height={"all-spacing-19"}
          $width={"all-spacing-19"}
          alt="a woman reading a book"
          src={getCloudinaryImageUrl(
            "v1747129947/svg-illustrations/reading_fiction_e43vpo.svg",
          )}
        />
      </OakFlex>
    </OakFlex>
  );
}
