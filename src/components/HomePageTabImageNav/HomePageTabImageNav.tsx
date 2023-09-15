import { Dispatch, SetStateAction } from "react";

import Flex, { FlexProps } from "@/components/Flex";
import HomePageTabImageButton from "@/components/NewButton.tsx/HomePageTabImageButton";
import { Hr } from "@/components/Typography";

const HomePageTabImageNav = ({
  current,
  setCurrent,
  ...flexProps
}: FlexProps & {
  current: string;
  setCurrent: Dispatch<SetStateAction<string>>;
}) => {
  const backgroundColor =
    current === "teachers"
      ? "mint"
      : current === "curriculum"
      ? "aqua"
      : current === "pupils"
      ? "lemon"
      : "white";
  return (
    <Flex $flexDirection={"column"}>
      <Flex
        as="nav"
        $width={"100%"}
        $pt={[40, 32]}
        $flexDirection={"row"}
        $ph={[12, 0]}
        $gap={[16, 32]}
        $justifyContent={"center"}
        $background={backgroundColor}
        {...flexProps}
      >
        <HomePageTabImageButton
          imageSlug={"teacher-carrying-stuff"}
          label={"Teaching resources"}
          isCurrent={current === "teachers"}
          isNew={false}
          onClick={() => setCurrent("teachers")}
        />
        <HomePageTabImageButton
          imageSlug={"teacher-reading-map"}
          label={"Curriculum plans"}
          isCurrent={current === "curriculum"}
          isNew={true}
          onClick={() => setCurrent("curriculum")}
          data-testid="curriculum-plans-button"
        />
        <HomePageTabImageButton
          imageSlug={"three-pupils-standing"}
          label={"Pupils"}
          isCurrent={current === "pupils"}
          isNew={false}
          onClick={() => setCurrent("pupils")}
        />
      </Flex>
      <Hr $mt={0} $mb={0} $color={"white"} />
    </Flex>
  );
};

export default HomePageTabImageNav;
