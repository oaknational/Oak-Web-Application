import { OakFlex } from "@oaknational/oak-components";

import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import HomePageTabImageButton from "@/components/GenericPagesComponents/HomepageTabImageButton";
import { Hr } from "@/components/SharedComponents/Typography";
import { HomePageTab } from "@/pages";

const HomePageTabImageNav = ({
  current,
  setCurrent,
  ...flexProps
}: FlexProps & {
  current: HomePageTab | undefined;
  setCurrent: (tab: HomePageTab) => void;
}) => {
  return (
    <OakFlex $flexDirection={"column"}>
      <Flex
        as="nav"
        $width={"100%"}
        $pt={[40, 32]}
        $flexDirection={"row"}
        $ph={[12, 0]}
        $pb={2}
        $gap={[16, 32]}
        $justifyContent={"center"}
        $background={getBackgroundColorByHomePageTab(current)}
        {...flexProps}
      >
        <HomePageTabImageButton
          activeImageSlug="teacher-carrying-stuff-1023-black"
          passiveImageSlug="teacher-carrying-stuff-1023-oakgrey4"
          label={"Teaching resources"}
          isCurrent={current === "teachers"}
          showNewIcon={false}
          onClick={() => setCurrent("teachers")}
        />
        <HomePageTabImageButton
          activeImageSlug="teacher-reading-map-1023-black"
          passiveImageSlug="teacher-reading-map-1023-oakgrey4"
          label={"Curriculum plans"}
          isCurrent={current === "curriculum"}
          showNewIcon={false}
          onClick={() => setCurrent("curriculum")}
          data-testid="curriculum-plans-button"
        />
        <HomePageTabImageButton
          activeImageSlug="juggling-teacher-1023-black"
          passiveImageSlug="juggling-teacher-1023-oakgrey4"
          label={"AI Experiments"}
          isCurrent={current === "ai"}
          showNewIcon={true}
          onClick={() => setCurrent("ai")}
        />
        <HomePageTabImageButton
          activeImageSlug="three-pupils-standing-1023-black"
          passiveImageSlug="three-pupils-standing-1023-oakgrey4"
          label={"Pupils"}
          isCurrent={current === "pupils"}
          showNewIcon={false}
          onClick={() => setCurrent("pupils")}
        />
      </Flex>
      <Hr $mt={0} $mb={0} $color={"white"} thickness={2} />
    </OakFlex>
  );
};

function getBackgroundColorByHomePageTab(current: HomePageTab | undefined) {
  if (current === "teachers") {
    return "mint";
  }
  if (current === "curriculum") {
    return "aqua";
  }
  if (current === "pupils") {
    return "lemon";
  }
  if (current === "ai") {
    return "pink";
  }
  return "white";
}

export default HomePageTabImageNav;
