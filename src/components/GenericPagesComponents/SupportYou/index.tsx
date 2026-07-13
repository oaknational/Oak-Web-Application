import {
  OakPrimaryButton,
  OakFlex,
  OakBox,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
  OakHeadingProps,
} from "@oaknational/oak-components";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";

import CMSImage from "@/components/SharedComponents/CMSImage/CMSImage";

export type SupportYouProps = {
  headingTag?: OakHeadingProps["tag"];
};

export function SupportYou({ headingTag = "h2" }: Readonly<SupportYouProps>) {
  return (
    <OakBox $pv={["spacing-56", "spacing-80", "spacing-80"]}>
      <NewGutterMaxWidth>
        <OakGrid $rg="spacing-24" $cg="spacing-16">
          <OakGridArea $colSpan={[12, 6, 5]}>
            <OakFlex
              $flexDirection="column"
              $gap="spacing-32"
              $flexGrow={1}
              $justifyContent="center"
            >
              <OakFlex $flexDirection="column" $gap="spacing-24">
                <OakHeading
                  $font={["heading-5", "heading-3", "heading-3"]}
                  tag={headingTag}
                >
                  Discover how Oak can support you
                </OakHeading>
                <OakP $font="body-1">
                  To explore the impact Oak’s curricula could have in your
                  school or trust, fill out the form below and one of our
                  experts will be in touch shortly.
                </OakP>
              </OakFlex>
              <OakFlex $flexDirection="column">
                <OakPrimaryButton
                  iconName="external"
                  isTrailingIcon={true}
                  element="a"
                  href="https://share.hsforms.com/2yBT-92_WT6CvX1b6L3Iw8Qbvumd"
                  target="_blank"
                  aria-label="Get in touch with an expert (opens in new tab)"
                >
                  Get in touch with an expert
                </OakPrimaryButton>
              </OakFlex>
            </OakFlex>
          </OakGridArea>
          <OakGridArea $colStart={[0, 7, 7]} $colSpan={[12, 6, 6]}>
            <OakFlex
              $flexGrow={1}
              $background={"bg-decorative1-subdued"}
              $aspectRatio={"4/3"}
            >
              <CMSImage
                $objectFit={"cover"}
                image={{
                  _id: "image-ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001-jpg",
                  url: "https://sanity-asset-cdn.thenational.academy/images/cuvjke51/production/ef2a05d634b1ade34d33664c44fa36cb62e1aaba-3000x2001.jpg",
                }}
              />
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </NewGutterMaxWidth>
    </OakBox>
  );
}
