import { OakFlex, OakHomepageTabButton } from "@oaknational/oak-components";

import { Hr } from "@/components/SharedComponents/Typography";

export type HomePageTab = "teachers" | "curriculum" | "ai" | "pupils";

const HomePageTabImageNav = ({ current }: { current: HomePageTab }) => {
  return (
    <OakFlex $flexDirection={"column"} $justifyContent={"center"}>
      <OakFlex
        as="nav"
        $background={"mint"}
        $width={"100%"}
        $alignItems={"stretch"}
        $justifyContent={"center"}
        $gap={["space-between-s", "space-between-m2"]}
        $pt={["inner-padding-xl3", "inner-padding-xl2"]}
        $ph={["inner-padding-s", null]}
        aria-label="Site sections"
      >
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
          title="AI Experiments"
          iconName="homepage-robot-waving"
          href="/ai"
          element="a"
          isActive={current === "ai"}
          showNewIcon={true}
        />
        <OakHomepageTabButton
          title="Pupils"
          iconName="homepage-three-pupils"
          href="/pupils"
          element="a"
          isActive={current === "pupils"}
        />
      </OakFlex>
      <Hr $mt={0} $mb={0} $color={"white"} thickness={2} />
    </OakFlex>
  );
};

export default HomePageTabImageNav;
