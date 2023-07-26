import { FC, MutableRefObject } from "react";

import Flex from "../Flex";
import OakLink from "../OakLink";
import { Heading } from "../Typography";

import CategoryHeading from "./CategoryHeading";
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
  expired: boolean | null;
  onClick?: () => void;
}

type ListItemHeadingProps = CommonProps &
  (LessonListItemProps | UnitListItemProps) & {
    title: LessonListItemProps["lessonTitle"] | UnitListItemProps["title"];
    slug: LessonListItemProps["lessonSlug"] | UnitListItemProps["slug"];
  };

const ListTitle: FC<{ children?: React.ReactNode; expired?: boolean }> = ({
  children,
  expired,
}) => {
  return (
    <Heading
      $color={expired ? "oakGrey4" : "black"}
      $font={["heading-7", expired ? "heading-light-6" : "heading-6"]}
      tag={"h3"}
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
  } = props;

  const itemTitle = title;

  if (expired) {
    return (
      <Flex $flexDirection={"column"}>
        <ListTitle expired={expired}>{itemTitle}</ListTitle>
      </Flex>
    );
  }

  return (
    <Flex>
      <Flex $flexDirection={"column"}>
        {!hideTopHeading && (
          <CategoryHeading
            keyStageTitle={keyStageTitle}
            subjectTitle={subjectTitle}
            page={page}
          />
        )}
        {"unitSlug" in props ? (
          // lesson
          <OakLink
            lessonSlug={slug}
            programmeSlug={programmeSlug}
            unitSlug={props.unitSlug}
            page={"lesson-overview"}
            viewType="teachers"
            onClick={onClick}
            {...primaryTargetProps}
          >
            <ListTitle>{itemTitle}</ListTitle>
          </OakLink>
        ) : (
          // unit
          <OakLink
            programmeSlug={programmeSlug}
            unitSlug={slug}
            page={"lesson-index"}
            viewType="teachers"
            onClick={onClick}
            {...primaryTargetProps}
          >
            <ListTitle>{itemTitle}</ListTitle>
          </OakLink>
        )}
      </Flex>
    </Flex>
  );
};

export default ListItemHeader;
