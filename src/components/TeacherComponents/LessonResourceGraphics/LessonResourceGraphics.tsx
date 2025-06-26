import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import LessonResourceGraphicsItem, {
  LessonResourceGraphicsItemProps,
} from "@/components/TeacherComponents/LessonResourceGraphicsItem";

type LessonResourceGraphicsProps = {
  items: LessonResourceGraphicsItemProps[];
};
/**
 * A collection graphics showing resources for a given lesson
 * ## Usage
 * Used on lesson listing page
 */

const LessonResourceGraphics: FC<LessonResourceGraphicsProps> = ({ items }) => {
  return (
    <OakFlex
      $gap={["space-between-xs", "space-between-s"]}
      $flexWrap="wrap"
      $justifyContent={"flex-start"}
    >
      {items.map((item, index) => (
        <LessonResourceGraphicsItem
          key={`graphics-item-${item.titleSingular}-${index}`}
          {...item}
        />
      ))}
    </OakFlex>
  );
};

export default LessonResourceGraphics;
