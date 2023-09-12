import { Dispatch, SetStateAction } from "react";

import { FlexProps } from "../Flex";
import Flex from "../Flex/Flex";
import HomePageTabImageButton from "../NewButton.tsx/HomePageTabImageButton";
import { Hr } from "../Typography";

const HomePageTabImageNav = ({
  current,
  setCurrent,
  ...flexProps
}: FlexProps & {
  current: string;
  setCurrent: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Flex $flexDirection={"column"}>
      <Flex
        $width={"100%"}
        $pt={[40, 32]}
        $flexDirection={"row"}
        $ph={[12, 0]}
        $gap={[16, 32]}
        $justifyContent={"center"}
        $background={"mint"}
        {...flexProps}
      >
        <HomePageTabImageButton
          imageSlug={"teacher-carrying-stuff"}
          label={"Teaching Resources"}
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
