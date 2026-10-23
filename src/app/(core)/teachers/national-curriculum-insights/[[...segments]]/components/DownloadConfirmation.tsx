import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakIcon,
  OakImage,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

export const NationalCurriculumInsightsDownloadConfirmation = () => (
  <OakGrid
    $maxWidth="spacing-1280"
    $mh="auto"
    $ph={["spacing-20", "spacing-40"]}
    $pv={["spacing-40", "spacing-64"]}
    $alignItems="center"
    $rg="spacing-40"
  >
    <OakGridArea $colSpan={[12, 12, 6]} $order={[2, 2, 1]}>
      <OakFlex $flexDirection="column" $gap="spacing-40">
        <OakBox role="status">
          <OakHeading tag="h2" $font="heading-4">
            Thanks for downloading!
          </OakHeading>
          <OakP $font="heading-light-5" $mt="spacing-12" $mb="spacing-0">
            Thinking about updating your curriculum?
          </OakP>
        </OakBox>
        <OakFlex $flexDirection="column" $gap="spacing-16">
          <OakFlex $gap="spacing-16" $alignItems="center">
            <OakImage
              src={getCloudinaryImageUrl("svg-illustrations/contact.svg")}
              alt=""
              width={40}
              height={40}
              $width="spacing-40"
              $height="spacing-40"
            />
            <OakLink
              href="/contact-us"
              $font="heading-light-6"
              variant="secondary"
            >
              Get in touch to find out how we can support you
            </OakLink>
          </OakFlex>
          <OakFlex $gap="spacing-16" $alignItems="center">
            <OakIcon
              iconName="search"
              $width="spacing-40"
              $height="spacing-40"
              aria-hidden="true"
            />
            <OakLink
              href="/teachers/curriculum"
              $font="heading-light-6"
              variant="secondary"
            >
              Explore curriculum plans and resources
            </OakLink>
          </OakFlex>
        </OakFlex>
        <OakP $font="body-1" $mv="spacing-0">
          Our resources are aligned to the current national curriculum but
          reflect many of the review&apos;s recommendations.
          <br />
          We&apos;ll update them once the curriculum is confirmed.
        </OakP>
      </OakFlex>
    </OakGridArea>
    <OakGridArea $colSpan={[12, 12, 6]} $order={[1, 1, 2]}>
      <OakImage
        src={getCloudinaryImageUrl(
          "svg-illustrations/download-confirmation.png",
        )}
        alt=""
        width={535}
        height={485}
        $width="auto"
        $height="auto"
        $maxWidth="100%"
        $mh="auto"
      />
    </OakGridArea>
  </OakGrid>
);
