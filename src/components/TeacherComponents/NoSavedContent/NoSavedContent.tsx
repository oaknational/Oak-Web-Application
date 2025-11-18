import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

const NoSavedContent = () => {
  return (
    <OakBox $ph={["spacing-20", "spacing-48"]}>
      <OakFlex
        $width="100%"
        $background="grey20"
        $borderRadius="border-radius-m2"
        $borderStyle="dashed"
        $borderColor="grey50"
        $height={["spacing-240", "spacing-360"]}
        $justifyContent="center"
        $alignItems="center"
        $flexDirection="column"
        $gap={"spacing-16"}
      >
        <OakHeading tag="h2" $font="heading-6">
          No units yet
        </OakHeading>
        <OakP $font="heading-light-7">
          Save your favourite units to view here.
        </OakP>
        <OakSecondaryButton
          iconName="arrow-right"
          isTrailingIcon
          element="a"
          href={resolveOakHref({
            page: "subject-index",
            keyStageSlug: "ks1",
          })}
        >
          Start saving
        </OakSecondaryButton>
      </OakFlex>
    </OakBox>
  );
};

export default NoSavedContent;
