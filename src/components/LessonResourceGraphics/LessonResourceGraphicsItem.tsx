import { FC } from "react";

import Flex from "../Flex";
import Icon, { IconName } from "../Icon";
import { Span } from "../Typography";
import lessonElementSvgSymbols from "../SpriteSheet/LessonElementSvgs/index";

const getResourceTitle = (resourceTitle: string, resourceCount: number) => {
  if (resourceCount > 1) {
    if (resourceTitle === "Quiz") {
      return "Quizzes";
    } else if (resourceTitle === "Slidedeck") {
      return "Slide decks";
    } else {
      return resourceTitle + "s";
    }
  }

  if (resourceTitle === "Slidedeck") return "Slide deck";

  return resourceTitle;
};

const capitalizedTitle = (title: string) => {
  return title.charAt(0).toUpperCase() + title.slice(1);
};

const isIconName = (title: string): title is IconName => {
  return Object.keys(lessonElementSvgSymbols).includes(title);
};

export type LessonResourceGraphicsItemProps = {
  title: string;
  resourceCount: number;
};

const LessonResourceGraphicsItem: FC<LessonResourceGraphicsItemProps> = ({
  title,
  resourceCount,
}) => {
  const resourceTitle = capitalizedTitle(title);
  return (
    <Flex
      $display={"flex"}
      $alignItems={"center"}
      $flexDirection={["column", "row"]}
      $mr={[32, 28]}
    >
      <Icon
        size={32}
        name={isIconName(resourceTitle) ? resourceTitle : "Download"}
        $mr={[0, 6]}
        $mb={[8, 0]}
      />
      <Flex $display={["none", "flex"]}>
        <Span $font={"body-3"}>
          {resourceCount} {getResourceTitle(resourceTitle, resourceCount)}
        </Span>
      </Flex>
    </Flex>
  );
};

export default LessonResourceGraphicsItem;
