import { DOMAttributes, FC, MouseEventHandler } from "react";
import { FocusableElement } from "@react-types/shared";

import Card from "../Card";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import { OakColorName } from "../../styles/theme/types";

import IconDesktop from "./IconDesktop";

export type ListItemCardProps = {
  title: string;
  icon: string;
  isHovered: boolean;
  children: React.ReactNode;
  background: OakColorName;
  expired: boolean | null;
  containerProps: {
    onClick: MouseEventHandler<HTMLDivElement>;
  } & Pick<DOMAttributes<FocusableElement>, "onClick">;
};

/**
 * Contains a lesson title, description, icon, and icons for resources
 * Links to a lesson-index page
 */
const ListItemCard: FC<ListItemCardProps> = (props) => {
  const {
    title,
    children,
    isHovered,
    containerProps,
    background,
    expired,
    icon,
  } = props;

  const applyHoverStyles = isHovered && !expired;

  return (
    <Card
      $justifyContent={"space-between"}
      $flexDirection={"row"}
      $mb={16}
      $overflow={"hidden"}
      $pa={0}
      {...(!expired ? containerProps : null)}
    >
      <Flex
        $transform={applyHoverStyles ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
        $width={"100%"}
        $position={"relative"}
        $flexDirection={"row"}
        $justifyContent={"space-between"}
        $dropShadow={applyHoverStyles ? "subjectCardHover" : "subjectCard"}
        $alignItems={"center"}
      >
        {children}
      </Flex>
      {!expired && (
        <IconDesktop
          title={title}
          icon={icon}
          background={background}
          isHovered={isHovered}
        />
      )}
      <BoxBorders
        $color={expired ? "oakGrey2" : "black"}
        gapPosition="bottomRightCorner"
      />
    </Card>
  );
};

export default ListItemCard;
