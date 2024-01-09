import Flex, { FlexProps } from "@/components/SharedComponents/Flex";
import HomePageTabImageButton from "@/components/NewButtons/HomepageTabImageButton/HomePageTabImageButton";
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
    <Flex $flexDirection={"column"}>
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
          isLegacyLesson={true}
          onClick={() => setCurrent("teachers")}
        />
        <HomePageTabImageButton
          activeImageSlug="teacher-reading-map-1023-black"
          passiveImageSlug="teacher-reading-map-1023-oakgrey4"
          label={"Curriculum plans"}
          isCurrent={current === "curriculum"}
          isLegacyLesson={false}
          onClick={() => setCurrent("curriculum")}
          data-testid="curriculum-plans-button"
        />
        <HomePageTabImageButton
          activeImageSlug="juggling-teacher-1023-black"
          passiveImageSlug="juggling-teacher-1023-oakgrey4"
          label={"AI Experiments"}
          isCurrent={current === "ai"}
          isLegacyLesson={false}
          onClick={() => setCurrent("ai")}
        />
        <HomePageTabImageButton
          activeImageSlug="three-pupils-standing-1023-black"
          passiveImageSlug="three-pupils-standing-1023-oakgrey4"
          label={"Pupils"}
          isCurrent={current === "pupils"}
          isLegacyLesson={true}
          onClick={() => setCurrent("pupils")}
        />
      </Flex>
      <Hr $mt={0} $mb={0} $color={"white"} thickness={2} />
    </Flex>
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
