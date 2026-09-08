import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";

export const ShortReads = () => {
  return (
    <OakBox $background="bg-decorative2-very-subdued" $width="100%">
      <OakMaxWidth
        $flexDirection="column"
        $alignItems="flex-start"
        $pv={["spacing-56", "spacing-80"]}
        $ph={["spacing-20", "spacing-40"]}
      >
        <ShortReadsHeader />
      </OakMaxWidth>
    </OakBox>
  );
};

const ShortReadsHeader = () => {
  return (
    <OakFlex
      $flexDirection={["column", "column", "row"]}
      $gap={["spacing-20", "spacing-40", "spacing-80"]}
    >
      <OakFlex $flexDirection="column" $gap="spacing-8">
        <OakHeading $font="heading-3" tag="h1">
          Short read guides
        </OakHeading>
        <OakP>
          Download the four short reads below to see the thinking behind each,
          how they work together and how you might adapt and build on them for
          your pupils.
        </OakP>
      </OakFlex>

      <OakBox $minWidth="max-content">
        <OakPrimaryButton iconName="download" isTrailingIcon>
          Download all guides
        </OakPrimaryButton>
      </OakBox>
    </OakFlex>
  );
};
