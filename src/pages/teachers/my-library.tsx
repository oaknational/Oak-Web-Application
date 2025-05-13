import {
  OakFlex,
  OakHeading,
  OakImage,
  OakMaxWidth,
  OakP,
} from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { Wall } from "@/components/AppComponents/Wall";
import AppLayout from "@/components/SharedComponents/AppLayout";
import withFeatureFlag from "@/hocs/withFeatureFlag";
import { withOnboardingRequired } from "@/hocs/withOnboardingRequired";
import { withPageAuthRequired } from "@/hocs/withPageAuthRequired";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

function MyLibraryPage() {
  return (
    <AppLayout seoProps={getSeoProps({ title: "My Library" })}>
      <OakMaxWidth $pv="inner-padding-xl">
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
            <OakFlex>
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
              development and lesson planning. Save what you need to your
              library.
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
      </OakMaxWidth>
    </AppLayout>
  );
}

export default withFeatureFlag(
  withPageAuthRequired(withOnboardingRequired(MyLibraryPage, Wall), Wall),
  "teacher-save-units",
);
