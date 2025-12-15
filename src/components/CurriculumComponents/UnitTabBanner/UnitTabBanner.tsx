import {
  OakHeading,
  OakP,
  OakFlex,
  OakIcon,
} from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

const UnitTabBanner = () => {
  return (
    <OakFlex
      $flexDirection={["column", "row"]}
      $background={"bg-decorative1-main"}
      $mt={"spacing-48"}
      $pa={"spacing-48"}
      $gap={"spacing-24"}
    >
      <OakFlex
        $flexDirection={["column", "row"]}
        $alignItems={["flex-start", "flex-end"]}
        $ma={"auto"}
        $justifyContent={["space-evenly"]}
        $gap="spacing-24"
      >
        <OakFlex $alignItems={"flex-start"} $flexDirection={["column", "row"]}>
          <OakIcon
            iconName="books"
            $width={"spacing-92"}
            $height={"spacing-92"}
            $mr={"spacing-48"}
            $mb={["spacing-24", "spacing-0"]}
          />

          {/* @todo replace with OakFlex - work out width value */}
          <Flex
            $width={["100%", "70%"]}
            $gap={16}
            $flexDirection={"column"}
            $alignItems={"flex-start"}
          >
            <OakHeading tag="h2" $font={["heading-5", "heading-4"]}>
              Need help with our new curriculum?
            </OakHeading>
            <OakP $font={["body-2", "body-1"]}>
              Visit our help centre for technical support as well as tips and
              ideas to help you make the most of Oak.
            </OakP>
          </Flex>
        </OakFlex>
        <ButtonAsLink
          label="Go to help centre"
          variant={"brush"}
          size={"large"}
          page={"help"}
          icon={"arrow-right"}
          iconBackground="black"
          $iconPosition="trailing"
        />
      </OakFlex>
    </OakFlex>
  );
};

export default UnitTabBanner;
