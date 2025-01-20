import {
  OakHeading,
  OakP,
  OakFlex,
  OakIcon,
} from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex.deprecated";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

const UnitTabBanner = () => {
  {
    /* @todo replace with OakFlex - work out padding value */
  }
  return (
    <Flex
      $flexDirection={["column", "row"]}
      $background={"mint"}
      $mt={48}
      $pa={48}
      $gap={24}
    >
      <OakFlex
        $flexDirection={["column", "row"]}
        $alignItems={["flex-start", "flex-end"]}
        $ma={"auto"}
        $justifyContent={["space-evenly"]}
        $gap="all-spacing-6"
      >
        <OakFlex $alignItems={"flex-start"} $flexDirection={["column", "row"]}>
          <OakIcon
            iconName="books"
            $width={"all-spacing-14"}
            $height={"all-spacing-14"}
            $mr={"space-between-l"}
            $mb={["space-between-m", "space-between-none"]}
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
    </Flex>
  );
};

export default UnitTabBanner;
