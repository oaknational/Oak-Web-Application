import { FC } from "react";

import Flex from "../Flex";
import Icon from "../Icon";
import { isIconName } from "../Icon/Icon";
import { Span } from "../Typography";

const getResourceTitle = (resourceTitle: string, resourceCount: number) => {
  if (resourceCount > 1) {
    if (resourceTitle === "Quiz") {
      return "Quizzes";
    } else {
      return resourceTitle + "s";
    }
  }
  return resourceTitle;
};

const capitalizedTitle = (title: string) => {
  return title.charAt(0).toUpperCase() + title.slice(1);
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
        name={isIconName(resourceTitle) ? resourceTitle : "download"}
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
