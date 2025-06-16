import React, { FC } from "react";
import {
  OakHeading,
  OakUL,
  OakHeadingTag,
  OakFlex,
  OakPagination,
  OakBox,
} from "@oaknational/oak-components";

import SignPostToAila from "../NoSearchResults/SignPostToAila";

import { LessonListSeoHelper } from "./LessonListSeoHelper";

import LessonListItem, {
  LessonListItemProps,
} from "@/components/TeacherComponents/LessonListItem";
import {
  UsePaginationProps,
  PaginationProps,
} from "@/components/SharedComponents/Pagination/usePagination";
import { SpecialistLessonListItemProps } from "@/components/TeacherComponents/LessonListItem/LessonListItem";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";
import { UnpublishedLessonListItem } from "@/node-lib/curriculum-api-2023/shared.schema";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export type LessonListProps = {
  lessonCount: number;
  lessonCountHeader: string;
  currentPageItems:
    | Array<
        | Omit<LessonListItemProps, "unitTitle" | "index" | "onClick">
        | UnpublishedLessonListItem
      >
    | SpecialistLesson[];
  keyStageSlug?: string;
  subjectSlug: string;
  paginationProps: PaginationProps & UsePaginationProps;
  headingTag: OakHeadingTag;
  unitTitle: string;
  onClick: (props: LessonListItemProps | SpecialistLessonListItemProps) => void;
  expiringBanner?: React.ReactNode;
  yearTitle?: string;
  subjectTitle?: string;
  programmeSlug?: string;
  examBoardSlug?: string | null;
};

const LESSONS_PER_PAGE = 5;

/**
 * Contains a list of lessons
 *
 * ## Usage
 * Used on lesson listing page
 */
const LessonList: FC<LessonListProps> = (props) => {
  const {
    lessonCount,
    lessonCountHeader,
    paginationProps,
    headingTag,
    currentPageItems,
    unitTitle,
    onClick,
    expiringBanner,
    yearTitle,
    subjectTitle,
    subjectSlug,
    keyStageSlug,
    programmeSlug,
    examBoardSlug,
  } = props;
  const { currentPage, pageSize, firstItemRef, paginationRoute } =
    paginationProps;

  const showSEOAccordion =
    programmeSlug &&
    !isSlugLegacy(programmeSlug) &&
    yearTitle &&
    keyStageSlug &&
    unitTitle &&
    subjectTitle;

  return (
    <OakFlex $flexDirection="column">
      <OakFlex
        $flexDirection={"column"}
        $gap={["space-between-m", "space-between-s"]}
        $mb={["space-between-m", "space-between-s"]}
      >
        <OakHeading $font={["heading-6", "heading-5"]} tag={headingTag}>
          {lessonCountHeader}
        </OakHeading>
        {expiringBanner}
      </OakFlex>

      {currentPageItems?.length ? (
        <>
          <OakUL aria-label="A list of lessons" $reset>
            {currentPageItems.map((item, index) => (
              <LessonListItem
                key={`${item.lessonSlug}-${index}`}
                {...props}
                {...item}
                unitTitle={unitTitle}
                hideTopHeading
                index={index + pageSize * (currentPage - 1)}
                firstItemRef={index === 0 ? firstItemRef : null}
                onClick={onClick}
              />
            ))}
          </OakUL>
        </>
      ) : null}

      {lessonCount > LESSONS_PER_PAGE ? (
        <OakBox
          $width="100%"
          $mt={["space-between-none", "auto"]}
          $pt={["inner-padding-xl4", "inner-padding-xl3"]}
          data-testid="pagination-box"
        >
          <OakPagination
            {...paginationProps}
            pageName={unitTitle}
            paginationHref={paginationRoute}
          />
        </OakBox>
      ) : null}

      <OakBox $pb={["inner-padding-xl2", "inner-padding-xl4"]}>
        <SignPostToAila
          title="Can't find what you need?"
          text="Create a tailor-made lesson plan and resources on any topic with Aila, our free AI-powered lesson assistant. Entirely adaptable to your class and context."
          keyStage={keyStageSlug}
          subject={subjectSlug}
        />
      </OakBox>

      {showSEOAccordion && (
        <LessonListSeoHelper
          examBoardSlug={examBoardSlug}
          keystageSlug={keyStageSlug}
          programmeSlug={programmeSlug}
          subjectTitle={subjectTitle}
          subjectSlug={subjectSlug}
          unitTitle={unitTitle}
          yearTitle={yearTitle}
        />
      )}
    </OakFlex>
  );
};

export default LessonList;
