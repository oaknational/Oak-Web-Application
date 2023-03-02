import { FC } from "react";

import Flex from "../Flex";

import LessonResourceGraphicsItem, {
  LessonResourceGraphicsItemProps,
} from "./LessonResourceGraphicsItem";

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
    <Flex>
      {items.map((item, index) => (
        <LessonResourceGraphicsItem
          key={`graphics-item-${item.titleSingular}-${index}`}
          {...item}
        />
      ))}
    </Flex>
  );
};

export default LessonResourceGraphics;
