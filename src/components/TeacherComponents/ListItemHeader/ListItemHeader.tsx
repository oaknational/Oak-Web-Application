import { FC, MutableRefObject } from "react";
import {
  OakHeading,
  OakFlex,
  OakSecondaryLink,
} from "@oaknational/oak-components";

import { LessonListItemProps } from "@/components/TeacherComponents/LessonListItem";
import ListItemHeaderCategoryHeading from "@/components/TeacherComponents/ListItemHeaderCategoryHeading";
import ListItemHeaderExpemplarCategoryHeading from "@/components/TeacherComponents/ListItemHeaderExpemplarCategoryHeading";
import {
  LessonListingLinkProps,
  LessonOverviewLinkProps,
  resolveOakHref,
  SpecialistLessonListingLinkProps,
  SpecialistLessonOverviewLinkProps,
} from "@/common-lib/urls";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";

type PrimaryTargetProps = {
  ref: MutableRefObject<HTMLAnchorElement | null>;
  $isHovered: boolean;
};

interface CommonProps {
  hideTopHeading?: boolean;
  primaryTargetProps: PrimaryTargetProps;
  page: "Lesson";
  onClick: () => void | undefined;
}

type SpecialistListItemProps = SpecialistLesson &
  CommonProps & {
    title: string;
    slug: string;
    subjectTitle: string;
    programmeSlug: string;
    expired: boolean | null;
    index?: number;
  };

export const isSpecialistUnit = (
  x: ListItemHeadingProps | SpecialistListItemProps,
): x is SpecialistListItemProps => {
  return "developmentStage" in x;
};

type ListItemHeadingProps = CommonProps &
  LessonListItemProps & {
    title: string;
    slug: string;
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
    <OakHeading
      $color={expired ? "text-subdued" : "text-primary"}
      $font={["heading-7", expired ? "heading-light-6" : "heading-6"]}
      tag={"h3"}
      ariaLabel={index !== undefined ? `${index + 1}. ${children}` : undefined}
    >
      {children}
    </OakHeading>
  );
};

export const DisabledListItemHeader = (props: {
  index: number;
  itemTitle: string;
}) => {
  const { index, itemTitle } = props;
  return (
    <OakFlex $flexDirection={"column"}>
      <ListTitle expired={true} index={index}>
        {itemTitle}
      </ListTitle>
    </OakFlex>
  );
};

const ListItemHeader: FC<ListItemHeadingProps | SpecialistListItemProps> = (
  props,
) => {
  const {
    title,
    slug,
    subjectTitle,
    hideTopHeading,
    primaryTargetProps,
    page,
    onClick,
    programmeSlug,
    index,
  } = props;

  const itemTitle = title;

  const linkProps:
    | LessonOverviewLinkProps
    | LessonListingLinkProps
    | SpecialistLessonListingLinkProps
    | SpecialistLessonOverviewLinkProps =
    "unitSlug" in props
      ? {
          lessonSlug: slug,
          page: isSpecialistUnit(props)
            ? "specialist-lesson-overview"
            : "lesson-overview",
          unitSlug: props.unitSlug,
          programmeSlug: programmeSlug,
        }
      : {
          page: isSpecialistUnit(props)
            ? "specialist-lesson-index"
            : "lesson-index",
          unitSlug: slug,
          programmeSlug: programmeSlug,
        };

  return (
    <OakFlex>
      <OakFlex $mb="spacing-4" $flexDirection={"column"}>
        {!hideTopHeading &&
          !isSpecialistUnit(props) &&
          !props.isExemplarUnit && (
            <ListItemHeaderCategoryHeading
              keyStageTitle={props.keyStageTitle}
              subjectTitle={subjectTitle}
              page={page}
            />
          )}
        {!hideTopHeading &&
          !isSpecialistUnit(props) &&
          props.isExemplarUnit && (
            <ListItemHeaderExpemplarCategoryHeading
              keyStageTitle={props.keyStageTitle}
              subjectTitle={subjectTitle}
              yearTitle={props.yearTitle}
            />
          )}
        <OakSecondaryLink
          onClick={onClick}
          {...primaryTargetProps}
          href={resolveOakHref(linkProps)}
        >
          <ListTitle index={index}>{itemTitle}</ListTitle>
        </OakSecondaryLink>
      </OakFlex>
    </OakFlex>
  );
};

export default ListItemHeader;
