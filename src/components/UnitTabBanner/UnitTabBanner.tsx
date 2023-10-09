import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Heading from "@/components/Typography/Heading";
import P from "@/components/Typography/P";

const UnitTabBanner = () => {
  return (
    <Flex
      $flexDirection={["column", "row"]}
      $background={"mint"}
      $mt={48}
      $pa={48}
      $gap={24}
    >
      <Flex
        $flexDirection={["column", "row"]}
        $alignItems={["flex-start", "flex-end"]}
        $ma={"auto"}
        $justifyContent={["space-evenly"]}
        $gap={24}
      >
        <Flex $alignItems={"flex-start"} $flexDirection={["column", "row"]}>
          <Icon
            name="books"
            size={92}
            $background={"teachersRed"}
            $mr={40}
            $mb={[24, 0]}
            $color={"black"}
          />

          <Flex
            $width={["100%", "70%"]}
            $gap={16}
            $flexDirection={"column"}
            $alignItems={"flex-start"}
          >
            <Heading tag="h2" $font={["heading-5", "heading-4"]}>
              Need help with our new curriculum?
            </Heading>
            <P $font={["body-2", "body-1"]}>
              Visit our help centre for technical support as well as tips and
              ideas to help you make the most of Oak.
            </P>
          </Flex>
        </Flex>
        <ButtonAsLink
          label="Go to help centre"
          variant={"brush"}
          size={"large"}
          page={"help"}
          icon={"arrow-right"}
          iconBackground="black"
          $iconPosition="trailing"
        />
      </Flex>
    </Flex>
  );
};

export default UnitTabBanner;
