import { FC } from "react";
import {
  OakHeading,
  OakLI,
  OakUL,
  OakHeadingTag,
  OakFlex,
} from "@oaknational/oak-components";

import LessonListItem, {
  LessonListItemProps,
} from "@/components/TeacherComponents/LessonListItem";
import Box from "@/components/SharedComponents/Box";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import { UsePaginationProps } from "@/components/SharedComponents/Pagination/usePagination";
import { SpecialistLesson } from "@/components/TeacherViews/SpecialistLessonListing/SpecialistLessonListing.view";
import { SpecialistLessonListItemProps } from "@/components/TeacherComponents/LessonListItem/LessonListItem";
import ComingSoonListItem from "@/components/TeacherComponents/ComingSoonListItem";

export type LessonListProps = {
  lessonCount: number;
  currentPageItems:
    | Omit<LessonListItemProps, "unitTitle" | "index" | "onClick">[]
    | SpecialistLesson[];
  keyStageSlug?: string;
  subjectSlug: string;
  paginationProps: PaginationProps & UsePaginationProps;
  headingTag: OakHeadingTag;
  unitTitle: string;
  onClick: (props: LessonListItemProps | SpecialistLessonListItemProps) => void;
  isNew: boolean;
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
    paginationProps,
    headingTag,
    currentPageItems,
    unitTitle,
    onClick,
    isNew,
  } = props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;
  return (
    <OakFlex $flexDirection="column">
      <OakFlex $flexDirection={["column-reverse", "column"]}>
        <OakHeading
          $font={["heading-6", "heading-5"]}
          $mb="space-between-m"
          tag={headingTag}
        >
          {`Lessons (${lessonCount})`}
        </OakHeading>
      </OakFlex>

      {currentPageItems?.length ? (
        <>
          <OakUL aria-label="A list of lessons" $reset>
            {currentPageItems.map((item, index) => (
              <OakLI
                key={`LessonList-LessonListItem-${item.lessonSlug}`}
                data-testid={"lesson-list-item"}
              >
                {isNew && item.expired ? (
                  <ComingSoonListItem
                    {...item}
                    index={index + pageSize * (currentPage - 1)}
                    firstItemRef={index === 0 ? firstItemRef : null}
                  />
                ) : (
                  <LessonListItem
                    {...item}
                    unitTitle={unitTitle}
                    hideTopHeading
                    index={index + pageSize * (currentPage - 1)}
                    firstItemRef={index === 0 ? firstItemRef : null}
                    onClick={onClick}
                  />
                )}
              </OakLI>
            ))}
          </OakUL>
        </>
      ) : null}
      {lessonCount > LESSONS_PER_PAGE ? (
        <Box $width="100%" $mt={[0, "auto"]} $pb={[30, 44]} $pt={[46, 36]}>
          <Pagination pageName={unitTitle} {...paginationProps} />
        </Box>
      ) : (
        <Box $pb={32} />
      )}
    </OakFlex>
  );
};

export default LessonList;
