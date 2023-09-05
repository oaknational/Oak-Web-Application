import { FC } from "react";

import Flex from "../Flex";
import Icon from "../Icon";
import { IconName } from "../Icon/Icon";
import { Span } from "../Typography";

const getResourceTitle = (
  { titleSingular, titlePlural }: LessonResourceGraphicsItemProps,
  resourceCount: number
) => {
  if (resourceCount === 1) {
    return titleSingular;
  } else {
    return titlePlural;
  }
};

export type LessonResourceGraphicsItemProps = {
  titleSingular: string;
  titlePlural: string;
  icon: IconName;
  resourceCount: number;
};

const LessonResourceGraphicsItem: FC<LessonResourceGraphicsItemProps> = (
  props
) => {
  const { icon, resourceCount } = props;
  return (
    <Flex
      $display={"flex"}
      $alignItems={"center"}
      $flexDirection={["column", "row"]}
      $mr={[32, 28]}
    >
      <Icon size={32} name={icon} $mr={[0, 6]} $mb={[8, 0]} />
      <Flex $display={["flex", "flex"]}>
        <Span $font={"body-3"}>
          {resourceCount} {getResourceTitle(props, resourceCount)}
        </Span>
      </Flex>
    </Flex>
  );
};

export default LessonResourceGraphicsItem;
