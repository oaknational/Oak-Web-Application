import { OakFlex, OakHomepageTabButton } from "@oaknational/oak-components";

import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import { Hr } from "@/components/SharedComponents/Typography";

export type HomePageTab = "teachers" | "curriculum" | "ai" | "pupils";

const HomePageTabImageNav = ({
  current,
  ...flexProps
}: FlexProps & {
  current: HomePageTab | undefined;
}) => {
  return (
    <OakFlex $flexDirection={"column"}>
      <Flex
        as="nav"
        $width={"100%"}
        $pt={[40, 32]}
        $flexDirection={"row"}
        $ph={[12, 0]}
        $gap={[16, 32]}
        $justifyContent={"center"}
        $background={"mint"}
        {...flexProps}
        aria-label="Site sections"
      >
        <OakHomepageTabButton
          title="AI Experiments"
          iconName="homepage-robot-waving"
          href="/ai"
          element="a"
          isActive={current === "ai"}
          showNewIcon={true}
        />
        <OakHomepageTabButton
          title="Teaching resources"
          iconName="homepage-teacher"
          href="/teachers"
          element="a"
          isActive={current === "teachers"}
        />
        <OakHomepageTabButton
          title="Curriculum plans"
          iconName="homepage-teacher-map"
          href="/curriculum"
          element="a"
          isActive={current === "curriculum"}
        />
        <OakHomepageTabButton
          title="Pupils"
          iconName="homepage-three-pupils"
          href="/pupils"
          element="a"
          isActive={current === "pupils"}
        />
      </Flex>
      <Hr $mt={0} $mb={0} $color={"white"} thickness={2} />
    </OakFlex>
  );
};

export default HomePageTabImageNav;
