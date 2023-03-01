import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import SubjectIcon from "../SubjectIcon";

export type IconDesktopProps = {
  title: string;
  subjectSlug: string;
  background: OakColorName;
  isHovered: boolean;
};

const IconDesktopContainer: FC<IconDesktopProps> = (props) => {
  const { background, isHovered, subjectSlug } = props;

  return (
    <Flex
      $justifyContent={"center"}
      $display={["none", "flex"]}
      $alignItems={"center"}
      $minHeight={110}
      $minWidth={130}
      $background={background}
      $position={"relative"}
      $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
      $transform={isHovered ? "translateY(-4px)" : null}
      $transition={"all 0.4s ease-out"}
    >
      <SubjectIcon subjectSlug={subjectSlug} height={96} width={96} $ma={"auto"} />
    </Flex>
  );
};

export default IconDesktopContainer;
