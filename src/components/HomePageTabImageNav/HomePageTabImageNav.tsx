import Flex, { FlexProps } from "@/components/Flex";
import HomePageTabImageButton from "@/components/NewButtons/HomepageTabImageButton/HomePageTabImageButton";
import { Hr } from "@/components/Typography";
import { HomePageTab } from "@/pages";

const HomePageTabImageNav = ({
  current,
  setCurrent,
  ...flexProps
}: FlexProps & {
  current: HomePageTab | undefined;
  setCurrent: (tab: HomePageTab) => void;
}) => {
  const backgroundColor =
    current === "teachers"
      ? "mint"
      : current === "curriculum"
      ? "aqua"
      : current === "pupils"
      ? "lemon"
      : current === "ai"
      ? "pupilsPink"
      : "white";
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
        $background={backgroundColor}
        {...flexProps}
      >
        <HomePageTabImageButton
          activeImageSlug="teacher-carrying-stuff-1023-black"
          passiveImageSlug="teacher-carrying-stuff-1023-oakgrey4"
          label={"Teaching resources"}
          isCurrent={current === "teachers"}
          isNew={false}
          onClick={() => setCurrent("teachers")}
        />
        <HomePageTabImageButton
          activeImageSlug="teacher-reading-map-1023-black"
          passiveImageSlug="teacher-reading-map-1023-oakgrey4"
          label={"Curriculum plans"}
          isCurrent={current === "curriculum"}
          isNew={true}
          onClick={() => setCurrent("curriculum")}
          data-testid="curriculum-plans-button"
        />
        <HomePageTabImageButton
          activeImageSlug="three-pupils-standing-1023-black"
          passiveImageSlug="three-pupils-standing-1023-oakgrey4"
          label={"Pupils"}
          isCurrent={current === "pupils"}
          isNew={false}
          onClick={() => setCurrent("pupils")}
        />
        <HomePageTabImageButton
          activeImageSlug="three-pupils-standing-1023-black"
          passiveImageSlug="three-pupils-standing-1023-oakgrey4"
          label={"AI"}
          isCurrent={current === "ai"}
          isNew={false}
          onClick={() => setCurrent("ai")}
        />
      </Flex>
      <Hr $mt={0} $mb={0} $color={"white"} thickness={2} />
    </Flex>
  );
};

export default HomePageTabImageNav;
