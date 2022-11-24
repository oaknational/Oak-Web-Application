import { FC } from "react";

import Flex from "../../Flex";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import { Heading, Span } from "../../Typography";
import { OakColorName } from "../../../styles/theme/types";

export type LearningTiersListItemProps = {
  title: string;
  numberUnits: number;
  numberLessons: number;
};

const LearningTiersListItem: FC<
  LearningTiersListItemProps & { background: OakColorName }
> = (props) => {
  const { title, background, numberLessons, numberUnits } = props;

  return (
    <Flex $position={"relative"} $flexDirection={"column"}>
      <Flex $background={background}>
        <Heading $ma={16} $font={"heading-7"} tag="h3">
          {title}
        </Heading>
      </Flex>
      <Flex $ma={16} $flexDirection={"column"}>
        <Span $font={"body-3"}>{`${numberUnits} units`}</Span>
        <Span $font={"body-3"}>{`${numberLessons} lessons`}</Span>
      </Flex>
      <BoxBorders gapPosition="rightTop" />
    </Flex>
  );
};

export default LearningTiersListItem;
