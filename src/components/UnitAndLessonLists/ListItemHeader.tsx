import { FC, MutableRefObject } from "react";

import Flex from "../Flex";
import OakLink from "../OakLink";
import { Heading } from "../Typography";

import CategoryHeading from "./CategoryHeading";
import ExemplarCategoryHeading from "./ExemplarCategoryHeading";
import { LessonListItemProps } from "./LessonList/LessonListItem";
import { UnitListItemProps } from "./UnitList/UnitListItem/UnitListItem";

type PrimaryTargetProps = {
  ref: MutableRefObject<HTMLAnchorElement | null>;
  $isHovered: boolean;
  fromSearchPage?: boolean;
};

interface CommonProps {
  hideTopHeading?: boolean;
  primaryTargetProps: PrimaryTargetProps;
  page: "Unit" | "Lesson";
  onClick?: () => void;
}

type ListItemHeadingProps = CommonProps &
  (LessonListItemProps | UnitListItemProps) & {
    title: LessonListItemProps["lessonTitle"] | UnitListItemProps["title"];
    slug: LessonListItemProps["lessonSlug"] | UnitListItemProps["slug"];
    expired: boolean | null;
    index?: number;
    isExemplarUnit?: boolean;
    yearTitle?: string | null;
  };

export const ListTitle: FC<{
  children?: React.ReactNode;
  expired?: boolean;
  index?: number;
}> = ({ children, expired, index }) => {
  return (
    <Heading
      $color={expired ? "grey60" : "black"}
      $font={["heading-7", expired ? "heading-light-6" : "heading-6"]}
      tag={"h3"}
      ariaLabel={index !== undefined ? `${index + 1}. ${children}` : undefined}
    >
      {children}
    </Heading>
  );
};

const ListItemHeader: FC<ListItemHeadingProps> = (props) => {
  const {
    title,
    slug,
    subjectTitle,
    hideTopHeading,
    keyStageTitle,
    primaryTargetProps,
    page,
    expired,
    onClick,
    programmeSlug,
    fromSearchPage,
    index,
    isExemplarUnit,
    yearTitle,
  } = props;

  const itemTitle = title;

  if (expired) {
    return (
      <Flex $flexDirection={"column"}>
        <ListTitle expired={true} index={fromSearchPage ? undefined : index}>
          {itemTitle}
        </ListTitle>
      </Flex>
    );
  }

  return (
    <Flex>
      <Flex $mb={2} $flexDirection={"column"}>
        {!hideTopHeading && !isExemplarUnit && (
          <CategoryHeading
            keyStageTitle={keyStageTitle}
            subjectTitle={subjectTitle}
            page={page}
          />
        )}
        {!hideTopHeading && isExemplarUnit && (
          <ExemplarCategoryHeading
            keyStageTitle={keyStageTitle}
            subjectTitle={subjectTitle}
            yearTitle={yearTitle}
          />
        )}
        {"unitSlug" in props ? (
          // lesson
          <OakLink
            lessonSlug={slug}
            programmeSlug={programmeSlug}
            unitSlug={props.unitSlug}
            page={"lesson-overview"}
            onClick={onClick}
            {...primaryTargetProps}
          >
            <ListTitle index={fromSearchPage ? undefined : index}>
              {itemTitle}
            </ListTitle>
          </OakLink>
        ) : (
          // unit
          <OakLink
            programmeSlug={programmeSlug}
            unitSlug={slug}
            page={"lesson-index"}
            onClick={onClick}
            {...primaryTargetProps}
          >
            <ListTitle index={fromSearchPage ? undefined : index}>
              {itemTitle}
            </ListTitle>
          </OakLink>
        )}
      </Flex>
    </Flex>
  );
};

export default ListItemHeader;
