import { FC } from "react";

import Flex from "../Flex";
import Icon, { IconName } from "../Icon";
import OakLink from "../OakLink/OakLink";
import { Span } from "../Typography";
import lessonElementSvgSymbols from "../SpriteSheet/LessonElementSvgs/index";

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

const isIconName = (title: string): title is IconName => {
  return Object.keys(lessonElementSvgSymbols).includes(title);
};

export type LessonResourceGraphicsItemProps = {
  title: string;
  resourceCount: number;
  href: string;
};

const LessonResourceGraphicsItem: FC<LessonResourceGraphicsItemProps> = ({
  title,
  resourceCount,
  href,
}) => {
  const resourceTitle = capitalizedTitle(title);
  return (
    <OakLink
      $display={"flex"}
      $alignItems={"center"}
      $flexDirection={["column", "row"]}
      href={href}
      page={null}
      $mr={[32, 28]}
    >
      <Icon
        size={32}
        name={isIconName(resourceTitle) ? resourceTitle : "Download"}
        $mr={[0, 6]}
        $mb={[8, 0]}
      />
      <Span $font={"body-3"} $mr={[0, 4]}>
        {resourceCount}
      </Span>
      <Flex $display={["none", "flex"]}>
        <Span $font={"body-3"}>
          {getResourceTitle(resourceTitle, resourceCount)}
        </Span>
      </Flex>
    </OakLink>
  );
};

export default LessonResourceGraphicsItem;
