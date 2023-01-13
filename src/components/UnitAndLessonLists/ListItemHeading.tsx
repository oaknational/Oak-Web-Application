import { FC, MutableRefObject } from "react";

import Flex from "../Flex";
import OakLink from "../OakLink";
import { Heading } from "../Typography";

import CategoryHeading from "./CategoryHeading";

type PrimaryTargetProps = {
  ref: MutableRefObject<HTMLAnchorElement | null>;
  $isHovered: boolean;
};

interface CommonProps {
  title: string;
  slug: string;
  keyStageSlug: string;
  subjectSlug: string;
  subjectTitle?: string;
  hideTopHeading?: boolean;
  keyStageTitle?: string;
  primaryTargetProps: PrimaryTargetProps;
}

interface Lesson extends CommonProps {
  page: "Lesson";
  unitSlug: string;
}

interface Unit extends CommonProps {
  page: "Unit";
}

type ListItemHeadingProps = Lesson | Unit;

function isLesson(x: ListItemHeadingProps): x is Lesson {
  return x.page === "Lesson";
}

function isUnit(x: ListItemHeadingProps): x is Unit {
  return x.page === "Unit";
}

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
  } = props;

  return (
    <Flex $mt={24} $flexDirection={"column"}>
      {!hideTopHeading && (
        <CategoryHeading
          keyStageTitle={keyStageTitle}
          subjectTitle={subjectTitle}
          page={page}
        />
      )}
      {isLesson(props) && (
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
      )}
      {isUnit(props) && (
        <OakLink
          slug={slug}
          keyStage={keyStageSlug}
          subject={subjectSlug}
          page={"lesson-index"}
          {...primaryTargetProps}
        >
          <ListTitle>{title}</ListTitle>
        </OakLink>
      )}
    </Flex>
  );
};

export default LessonListItem;
