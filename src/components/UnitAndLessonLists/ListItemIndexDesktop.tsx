import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import OutlineHeading from "../OutlineHeading/OutlineHeading";

export type ListItemIndexDesktopProps = {
  index: number;
  background: OakColorName;
  isHovered: boolean;
  fromSearchPage?: boolean;
};

const ListItemIndexDesktop: FC<ListItemIndexDesktopProps> = (props) => {
  const { background, isHovered, index, fromSearchPage } = props;

  const indexString = index ? index.toString() : "";

  return (
    <Flex
      $justifyContent={"center"}
      $display={["none", "flex"]}
      $alignItems={"center"}
      $minWidth={80}
      $background={background}
      $position={"relative"}
      $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
      $transform={isHovered ? "translateY(-4px)" : null}
      $transition={"all 0.4s ease-out"}
    >
      {!fromSearchPage && indexString && (
        <OutlineHeading tag={"h1"} $fontSize={32}>
          {indexString}
        </OutlineHeading>
      )}
    </Flex>
  );
};

export default ListItemIndexDesktop;
