import { FC } from "react";

import LessonResourceGraphicsItem, {
  LessonResourceGraphicsItemProps,
} from "./LessonResourceGraphicsItem";

import Flex from "@/components/SharedComponents/Flex";


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
    <Flex $justifyContent={["space-evenly", "flex-start"]}>
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
