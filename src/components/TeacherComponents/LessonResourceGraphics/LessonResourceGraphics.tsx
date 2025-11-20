import { FC } from "react";
import { OakLI, OakUL } from "@oaknational/oak-components";

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
    <OakUL
      $reset={true}
      $display={"flex"}
      $gap={["spacing-12", "spacing-16"]}
      $flexWrap="wrap"
      $justifyContent={"flex-start"}
    >
      {items.map((item, index) => (
        <OakLI key={`graphics-item-${item.titleSingular}-${index}`}>
          <LessonResourceGraphicsItem {...item} />
        </OakLI>
      ))}
    </OakUL>
  );
};

export default LessonResourceGraphics;
