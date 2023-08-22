import { FC } from "react";

import LessonListItem, { LessonListItemProps } from "./LessonListItem";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Pagination, { PaginationProps } from "@/components/Pagination";
import { UsePaginationProps } from "@/components/Pagination/usePagination";
import { Heading, LI, UL } from "@/components/Typography";
import { HeadingTag } from "@/components/Typography/Heading";

export type LessonListProps = {
  lessonCount: number;
  currentPageItems: Omit<LessonListItemProps, "unitTitle" | "index">[];
  keyStageSlug: string;
  subjectSlug: string;
  paginationProps: PaginationProps & UsePaginationProps;
  headingTag: HeadingTag;
  unitTitle: string;
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
                />
              </LI>
            ))}
          </UL>
        </>
      ) : null}
      {lessonCount > LESSONS_PER_PAGE && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default LessonList;
