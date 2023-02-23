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
};

interface CommonProps {
  hideTopHeading?: boolean;
  primaryTargetProps: PrimaryTargetProps;
  page: "Unit" | "Lesson";
  expired: boolean | null;
}

type ListItemHeadingProps = CommonProps &
  (LessonListItemProps | UnitListItemProps) & { index: number | null };

const ListTitle: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Heading $mb={12} $font={["heading-7", "heading-6"]} tag={"h3"}>
      {children}
    </Heading>
  );
};

const LessonListItem: FC<ListItemHeadingProps> = (props) => {
  const {
    title,
    slug,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    hideTopHeading,
    keyStageTitle,
    primaryTargetProps,
    page,
    index,
    expired,
  } = props;

  if (expired) {
    return (
      <Flex $mt={24} $flexDirection={"column"}>
        <ListTitle>{title}</ListTitle>
      </Flex>
    );
  }

  return (
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
          keyStage={keyStageSlug}
          subject={subjectSlug}
          unit={props.unitSlug}
          page={"lesson-overview"}
          {...primaryTargetProps}
        >
          <ListTitle>{title}</ListTitle>
        </OakLink>
      ) : (
        // unit
        <OakLink
          slug={slug}
          keyStage={keyStageSlug}
          subject={subjectSlug}
          page={"lesson-index"}
          {...primaryTargetProps}
        >
          <ListTitle>
            {index !== null ? `${index + 1}.` : ""} {title}
          </ListTitle>
        </OakLink>
      )}
    </Flex>
  );
};

export default LessonListItem;
