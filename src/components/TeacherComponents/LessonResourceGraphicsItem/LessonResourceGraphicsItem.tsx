import { FC } from "react";
import { OakSpan, OakFlex } from "@oaknational/oak-components";

import Icon, { IconName } from "@/components/SharedComponents/Icon";

const getResourceTitle = (
  { titleSingular, titlePlural }: LessonResourceGraphicsItemProps,
  resourceCount: number,
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
  props,
) => {
  const { icon, resourceCount } = props;
  return (
    <OakFlex
      $display={"flex"}
      $alignItems={"center"}
      $flexDirection={["column", "row"]}
      $mr={["space-between-none", "space-between-m"]}
    >
      <Icon size={32} name={icon} $mr={[0, 6]} $mb={[8, 0]} />
      <OakFlex>
        <OakSpan $font={"body-3"}>
          {resourceCount} {getResourceTitle(props, resourceCount)}
        </OakSpan>
      </OakFlex>
    </OakFlex>
  );
};

export default LessonResourceGraphicsItem;
