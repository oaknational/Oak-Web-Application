import { DOMAttributes, FC, MouseEventHandler } from "react";
import { FocusableElement } from "@react-types/shared";

import Card from "../Card";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import { OakColorName } from "../../styles/theme/types";

import IconDesktop from "./IconDesktop";

export type ListItemCardProps = {
  title: string;
  isHovered: boolean;
  children: React.ReactNode;
  background: OakColorName;
  containerProps: {
    onClick: MouseEventHandler<HTMLDivElement>;
  } & Pick<DOMAttributes<FocusableElement>, "onClick">;
};

/**
 * Contains a lesson title, description, icon, and icons for resources
 * Links to a lesson-index page
 */
const ListItemCard: FC<ListItemCardProps> = (props) => {
  const { title, children, isHovered, containerProps } = props;
  //   const { containerProps, isHovered } = useClickableCard<HTMLAnchorElement>();

  return (
    <Card
      $justifyContent={"space-between"}
      $flexDirection={"row"}
      $mb={16}
      $overflow={"hidden"}
      {...containerProps}
      $pa={0}
    >
      <Flex
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
        $width={"100%"}
        $position={"relative"}
        $flexDirection={"row"}
        $justifyContent={"space-between"}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $alignItems={"center"}
      >
        {children}
      </Flex>
      <IconDesktop
        title={title}
        background={"teachersLilac"}
        isHovered={isHovered}
      />
      <BoxBorders gapPosition="bottomRightCorner" />
    </Card>
  );
};

export default ListItemCard;
