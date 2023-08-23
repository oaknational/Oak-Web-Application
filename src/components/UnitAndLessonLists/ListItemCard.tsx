import { DOMAttributes, FC, MouseEventHandler } from "react";
import { FocusableElement } from "@react-types/shared";

import Card from "@/components/Card";
import Flex from "@/components/Flex";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders";
import { OakColorName } from "@/styles/theme/types";

export type ListItemCardProps = {
  title: string;
  subjectSlug: string;
  isHovered: boolean;
  children: React.ReactNode;
  background: OakColorName;
  expired: boolean | null;
  index: number;
  fromSearchPage?: boolean;
  containerProps: {
    onClick: MouseEventHandler<HTMLDivElement>;
  } & Pick<DOMAttributes<FocusableElement>, "onClick">;
  isUnitOption?: boolean;
};

/**
 * Contains a lesson title, description, icon, and icons for resources
 * Links to a lesson-index page
 */

const ListItemCard: FC<ListItemCardProps> = (props) => {
  const { children, isHovered, containerProps, background, expired } = props;

  const applyHoverStyles = isHovered && !expired;

  return (
    <Card
      $justifyContent={"space-between"}
      $flexDirection={"row"}
      $mb={16}
      $minHeight={80}
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
        $alignItems={"start"}
        $background={background}
      >
        {children}
      </Flex>

      <BoxBorders
        $color={expired ? "oakGrey2" : "black"}
        gapPosition="bottomRightCorner"
      />
    </Card>
  );
};

export default ListItemCard;
