import { FC, MutableRefObject } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import { LessonListItemProps } from "@/components/TeacherComponents/LessonListItem";
import { UnitListItemProps } from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import ListItemHeaderCategoryHeading from "@/components/TeacherComponents/ListItemHeaderCategoryHeading";
import ListItemHeaderExpemplarCategoryHeading from "@/components/TeacherComponents/ListItemHeaderExpemplarCategoryHeading";
import {
  LessonListingLinkProps,
  LessonOverviewLinkProps,
} from "@/common-lib/urls";
import { IndividualSpecialistUnit } from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.view";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";

type PrimaryTargetProps = {
  ref: MutableRefObject<HTMLAnchorElement | null>;
  $isHovered: boolean;
};

interface CommonProps {
  hideTopHeading?: boolean;
  primaryTargetProps: PrimaryTargetProps;
  page: "Unit" | "Lesson";
  onClick: () => void;
}

type SpecialistListItemProps = (IndividualSpecialistUnit | SpecialistLesson) &
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
  return "developmentalStageTitle" in x;
};

type ListItemHeadingProps = CommonProps &
  (LessonListItemProps | UnitListItemProps) & {
    title: string;
    slug: string;
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
    <OakHeading
      $color={expired ? "grey60" : "black"}
      $font={["heading-7", expired ? "heading-light-6" : "heading-6"]}
      tag={"h3"}
      ariaLabel={index !== undefined ? `${index + 1}. ${children}` : undefined}
    >
      {children}
    </OakHeading>
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
    expired,
    onClick,
    programmeSlug,
    index,
  } = props;

  const itemTitle = title;

  const linkProps: LessonOverviewLinkProps | LessonListingLinkProps =
    "unitSlug" in props
      ? {
          lessonSlug: slug,
          page: "lesson-overview",
          unitSlug: props.unitSlug,
          programmeSlug: programmeSlug,
        }
      : { page: "lesson-index", unitSlug: slug, programmeSlug: programmeSlug };

  if (expired) {
    return (
      <OakFlex $flexDirection={"column"}>
        <ListTitle expired={true} index={index}>
          {itemTitle}
        </ListTitle>
      </OakFlex>
    );
  }

  return (
    <OakFlex>
      <OakFlex $mb="space-between-sssx" $flexDirection={"column"}>
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
        <OwaLink onClick={onClick} {...primaryTargetProps} {...linkProps}>
          <ListTitle index={index}>{itemTitle}</ListTitle>
        </OwaLink>
      </OakFlex>
    </OakFlex>
  );
};

export default ListItemHeader;
