import { FC } from "react";

import LessonListItem, {
  LessonListItemProps,
} from "@/components/TeacherComponents/LessonListItem";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import { UsePaginationProps } from "@/components/SharedComponents/Pagination/usePagination";
import {
  Heading,
  LI,
  UL,
  HeadingTag,
} from "@/components/SharedComponents/Typography";
import { SpecialistLesson } from "@/components/TeacherViews/SpecialistLessonListing/SpecialistLessonListing.view";
import { SpecialistLessonListItemProps } from "@/components/TeacherComponents/LessonListItem/LessonListItem";

export type LessonListProps = {
  lessonCount: number;
  currentPageItems:
    | Omit<LessonListItemProps, "unitTitle" | "index" | "onClick">[]
    | SpecialistLesson[];
  keyStageSlug?: string;
  subjectSlug: string;
  paginationProps: PaginationProps & UsePaginationProps;
  headingTag: HeadingTag;
  unitTitle: string;
  onClick: (props: LessonListItemProps | SpecialistLessonListItemProps) => void;
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
  } = props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;
  return (
    <Flex $flexDirection="column">
      <Flex $flexDirection={["column-reverse", "column"]}>
        <Heading $font={["heading-6", "heading-5"]} $mb={24} tag={headingTag}>
          {`Lessons (${lessonCount})`}
        </Heading>
      </Flex>

      {currentPageItems.length ? (
        <>
          <UL aria-label="A list of lessons" $reset>
            {currentPageItems.map((item, index) => (
              <LI key={`LessonList-LessonListItem-${item.lessonSlug}`}>
                <LessonListItem
                  {...item}
                  unitTitle={unitTitle}
                  hideTopHeading
                  index={index + pageSize * (currentPage - 1)}
                  firstItemRef={index === 0 ? firstItemRef : null}
                  onClick={onClick}
                />
              </LI>
            ))}
          </UL>
        </>
      ) : null}
      {lessonCount > LESSONS_PER_PAGE ? (
        <Box $width="100%" $mt={[0, "auto"]} $pb={[30, 44]} $pt={[46, 36]}>
          <Pagination pageName={unitTitle} {...paginationProps} />
        </Box>
      ) : (
        <Box $pb={32} />
      )}
    </Flex>
  );
};

export default LessonList;
