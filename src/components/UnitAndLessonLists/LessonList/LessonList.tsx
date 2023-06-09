import { FC } from "react";

import Box from "../../Box";
import Flex from "../../Flex";
import Pagination, { PaginationProps } from "../../Pagination";
import { UsePaginationProps } from "../../Pagination/usePagination";
import { Heading, LI, UL } from "../../Typography";
import { HeadingTag } from "../../Typography/Heading";

import LessonListItem, { LessonListItemProps } from "./LessonListItem";

export type LessonListProps = {
  lessons: Omit<LessonListItemProps, "unitTitle" | "index">[];
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
  const { lessons, paginationProps, headingTag, currentPageItems, unitTitle } =
    props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;
  return (
    <Flex $flexDirection="column">
      <Flex $flexDirection={["column-reverse", "column"]}>
        <Heading $font={["heading-6", "heading-5"]} $mb={24} tag={headingTag}>
          {`Lessons (${lessons.length})`}
        </Heading>
      </Flex>

      {currentPageItems.length ? (
        <>
          <UL $reset>
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
      {lessons.length > LESSONS_PER_PAGE && (
        <Box $width="100%" $mt={[0, "auto"]} $pt={48}>
          <Pagination {...paginationProps} />
        </Box>
      )}
    </Flex>
  );
};

export default LessonList;
