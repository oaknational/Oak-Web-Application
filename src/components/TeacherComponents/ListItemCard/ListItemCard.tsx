import { DOMAttributes, FC, MouseEventHandler } from "react";
import { FocusableElement } from "@react-types/shared";
import { OakFlex, OakUiRoleToken } from "@oaknational/oak-components";

import Card from "@/components/SharedComponents/Card";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

export type ListItemCardProps = {
  title: string;
  subjectSlug: string;
  isHovered: boolean;
  children: React.ReactNode;
  background: OakUiRoleToken;
  disabled: boolean | null;
  index: number;
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
  const {
    children,
    isHovered,
    containerProps,
    background,
    disabled: expired,
  } = props;

  const applyHoverStyles = isHovered && !expired;

  return (
    <Card
      role="listitem"
      $justifyContent={"space-between"}
      $flexDirection={"row"}
      $mb={16}
      $minHeight={80}
      $overflow={"hidden"}
      $pa={0}
      {...(!expired ? containerProps : null)}
    >
      <OakFlex
        $transition={"standard-ease"}
        $width={"100%"}
        $position={"relative"}
        $flexDirection={"row"}
        $justifyContent={"space-between"}
        $alignItems={"start"}
        $background={applyHoverStyles ? "bg-neutral" : background}
        data-testid="list-item-card-container"
      >
        {children}
      </OakFlex>

      <BoxBorders
        $color={expired ? "bg-neutral-stronger" : "bg-inverted"}
        gapPosition="bottomRightCorner"
      />
    </Card>
  );
};

export default ListItemCard;
