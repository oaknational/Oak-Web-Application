import { FC } from "react";

import Box from "../../Box";
import Flex from "../../Flex";
import Pagination, { PaginationProps } from "../../Pagination";
import { Heading, LI, UL } from "../../Typography";
import { HeadingTag } from "../../Typography/Heading";

import LessonListItem, { LessonListItemProps } from "./LessonListItem";

export type LessonListProps = {
  lessons: Omit<LessonListItemProps, "unitTitle">[];
  currentPageItems: Omit<LessonListItemProps, "unitTitle">[];
  keyStageSlug: string;
  subjectSlug: string;
  paginationProps: PaginationProps;
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
            {currentPageItems.map((item) => (
              <LI key={`LessonList-LessonListItem-${item.slug}`}>
                <LessonListItem
                  {...item}
                  unitTitle={unitTitle}
                  hideTopHeading
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
