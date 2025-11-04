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
      $gap="spacing-4"
      $mr={["spacing-0", "spacing-24"]}
    >
      <OakIcon
        $width="spacing-32"
        $height="spacing-32"
        iconName={icon}
        $mr={["spacing-0", "spacing-8"]}
        $mb={["spacing-8", "spacing-0"]}
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
