import { FC, MutableRefObject } from "react";

import Flex from "../Flex";
import OakLink from "../OakLink";
import { Heading } from "../Typography";

import CategoryHeading from "./CategoryHeading";
import ListItemIconMobile from "./ListItemIconMobile";
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
      $mb={12}
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
    subjectSlug,
    subjectTitle,
    hideTopHeading,
    keyStageTitle,
    primaryTargetProps,
    page,
    index,
    expired,
    onClick,
    programmeSlug,
    fromSearchPage,
  } = props;

  if (expired) {
    return (
      <Flex $mt={24} $flexDirection={"column"}>
        <ListTitle expired={expired}>
          {index !== null && !fromSearchPage ? `${index + 1}.` : ""} {title}
        </ListTitle>
      </Flex>
    );
  }

  return (
    <Flex>
      <Flex $mt={24} $flexDirection={"column"}>
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
            slug={slug}
            programmeSlug={programmeSlug}
            unitSlug={props.unitSlug}
            page={"lesson-overview"}
            viewType="teachers"
            onClick={onClick}
            {...primaryTargetProps}
          >
            <ListTitle>
              {index !== null && !fromSearchPage ? `${index + 1}.` : ""} {title}
            </ListTitle>
          </OakLink>
        ) : (
          // unit
          <OakLink
            programmeSlug={programmeSlug}
            slug={slug}
            page={"lesson-index"}
            viewType="teachers"
            onClick={onClick}
            {...primaryTargetProps}
          >
            <ListTitle>
              {index !== null && !fromSearchPage ? `${index + 1}.` : ""} {title}
            </ListTitle>
          </OakLink>
        )}
      </Flex>

      <ListItemIconMobile
        background={page == "Unit" ? "teachersLilac" : "pupilsPink"}
        subjectSlug={subjectSlug}
      />
    </Flex>
  );
};

export default ListItemHeader;
