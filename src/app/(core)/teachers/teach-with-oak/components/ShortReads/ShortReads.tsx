import {
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";

export const ShortReads = () => {
  return (
    <OakFlex $flexDirection="column" $alignItems="flex-start">
      <OakHeading $font="heading-3" tag="h1">
        Short read guides
      </OakHeading>
      <OakP>
        Download the four short reads below to see the thinking behind each, how
        they work together and how you might adapt and build on them for your
        pupils.
      </OakP>
      <OakPrimaryButton>Download all guides</OakPrimaryButton>
    </OakFlex>
  );
};
