import { FC } from "react";
import {
  OakSpan,
  OakFlex,
  OakIcon,
  OakIconName,
} from "@oaknational/oak-components";

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
  icon: OakIconName;
  resourceCount: number;
};

const LessonResourceGraphicsItem: FC<LessonResourceGraphicsItemProps> = (
  props,
) => {
  const { icon, resourceCount } = props;
  return (
    <OakFlex
      $alignItems={"center"}
      $justifyContent={"center"}
      $gap="space-between-sssx"
      $mr={["space-between-none", "space-between-m"]}
    >
      <OakIcon
        $width="all-spacing-7"
        $height="all-spacing-7"
        iconName={icon}
        $mr={["space-between-none", "space-between-ssx"]}
        $mb={["space-between-ssx", "space-between-none"]}
        alt=""
      />
      <OakFlex>
        <OakSpan $font={"body-3"}>
          {resourceCount} {getResourceTitle(props, resourceCount)}
        </OakSpan>
      </OakFlex>
    </OakFlex>
  );
};

export default LessonResourceGraphicsItem;
