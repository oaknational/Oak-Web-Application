import { FC } from "react";
import { useHover } from "react-aria";

import useClickableCard from "../../../hooks/useClickableCard";

import Flex from "../../Flex";
import Icon, { IconName } from "../../Icon";
import { Heading } from "../../Typography";
import { OakColorName } from "../../../styles/theme/types";

export type UnitListItemProps = {
  title: string;
  learningTheme?: string;
  totalLessons: number;
  unitQuiz?: string;
  subjectIcon: IconName;
  background: OakColorName;
};

/**
 * Contains an image, title, and text summary.
 * The component contains a link styled as a button, which
 * whose click target stretches across the entire component.
 * The title tag (h1, h2, ...) is passed as a prop.
 */
const UnitListItem: FC<UnitListItemProps> = (props) => {
  const { title, learningTheme, totalLessons, unitQuiz, subjectIcon } = props;

  const {
    containerProps,
    primaryTargetProps,
    isHovered: cardIsHovered,
  } = useClickableCard<HTMLAnchorElement>();
  const { hoverProps: categoryHoverProps, isHovered: categoryIsHovered } =
    useHover({});

  return (
    <Flex
      {...containerProps}
      $position={"relative"}
      $flexDirection={["column", "row"]}
      $justifyContent={"space-between"}
      $alignItems={"center"}
      $pa={0}
    >
      <Flex $flexDirection={"column"}>
        <Heading $font={"heading-6"} tag={"h3"}>
          {title}
        </Heading>
        <Flex $flexDirection={["column", "row"]}>
          {learningTheme && (
            <Heading $font={"heading-light-7"} tag={"h4"}>
              {learningTheme}
            </Heading>
          )}
          <Heading $font={"heading-light-7"} tag={"h4"}>
            {totalLessons}
          </Heading>
          {unitQuiz && (
            <Heading $font={"heading-light-7"} tag={"h4"}>
              {unitQuiz}
            </Heading>
          )}
        </Flex>
      </Flex>
      <Flex
        $justifyContent={"center"}
        $alignItems={"center"}
        $minHeight={110}
        $width={[72, 130]}
        $background={"pupilsPink"}
      >
        <Icon size={92} name={subjectIcon}>
          {title}
        </Icon>
      </Flex>
    </Flex>
  );
};

export default UnitListItem;
