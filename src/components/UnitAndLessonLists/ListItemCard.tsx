import { DOMAttributes, FC, MouseEventHandler } from "react";
import { FocusableElement } from "@react-types/shared";

import Card from "../Card";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import { OakColorName } from "../../styles/theme/types";

import ListItemIndexDesktop from "./ListItemIndexDesktop";
import ListItemIndexMobile from "./ListItemIndexMobile";

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
};

/**
 * Contains a lesson title, description, icon, and icons for resources
 * Links to a lesson-index page
 */

const ListItemCard: FC<ListItemCardProps> = (props) => {
  const {
    children,
    isHovered,
    containerProps,
    background,
    expired,
    index,
    fromSearchPage,
  } = props;

  const applyHoverStyles = isHovered && !expired;

  return (
    <Card
      $justifyContent={"space-between"}
      $flexDirection={"row"}
      $mb={16}
      $minHeight={96}
      $overflow={"hidden"}
      $pa={0}
      {...(!expired ? containerProps : null)}
    >
      {!expired && (
        <>
          <ListItemIndexDesktop
            index={index + 1}
            background={background}
            isHovered={isHovered}
            fromSearchPage={fromSearchPage}
          />
          <ListItemIndexMobile
            background={background}
            index={index + 1}
            fromSearchPage={fromSearchPage}
          />
        </>
      )}
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

      <BoxBorders
        $color={expired ? "oakGrey2" : "black"}
        gapPosition="bottomRightCorner"
      />
    </Card>
  );
};

export default ListItemCard;
