import { FC } from "react";
import { OakLI, OakUL } from "@oaknational/oak-components";
import styled from "styled-components";

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

const StyledOakUL = styled(OakUL)`
  list-style: none;
`;

const LessonResourceGraphics: FC<LessonResourceGraphicsProps> = ({ items }) => {
  return (
    <StyledOakUL
      $display={"flex"}
      $ph={"inner-padding-none"}
      $gap={["space-between-xs", "space-between-s"]}
      $flexWrap="wrap"
      $justifyContent={"flex-start"}
    >
      {items.map((item, index) => (
        <OakLI key={`graphics-item-${item.titleSingular}-${index}`}>
          <LessonResourceGraphicsItem {...item} />
        </OakLI>
      ))}
    </StyledOakUL>
  );
};

export default LessonResourceGraphics;
