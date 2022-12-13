import { FC } from "react";

import Box from "../../Box";
import Flex from "../../Flex";
import Pagination, { PaginationProps } from "../../Pagination";
import { Heading, LI, Span, UL } from "../../Typography";
import { HeadingTag } from "../../Typography/Heading";
// import OakLink from "../../OakLink";

import LessonListItem, { LessonListItemProps } from "./LessonListItem";

export type Tier = {
  title: string;
  slug: string;
  unitCount: number;
};

export type LessonListProps = {
  lessons: LessonListItemProps[];
  currentPageItems: LessonListItemProps[];
  keyStageSlug: string;
  subjectSlug: string;
  paginationProps: PaginationProps;
  headingTag: HeadingTag;
  availableTiers: Tier[];
};

const LESSONS_PER_PAGE = 5;

/**
 * Contains a list of units
 *
 * ## Usage
 * Used on subject, unit and search results page
 */
const UnitList: FC<LessonListProps> = (props) => {
  const { lessons, paginationProps, headingTag, currentPageItems } = props;

  return (
    <Flex $flexDirection="column">
      <Flex $flexDirection={["column-reverse", "column"]}>
        <Heading $font={["heading-6", "heading-5"]} $mb={24} tag={headingTag}>
          Lessons
        </Heading>
      </Flex>

      {currentPageItems.length ? (
        <>
          <UL $reset>
            {currentPageItems.map((item) => (
              <LI key={`UnitList-UnitListItem-${item.slug}`}>
                <LessonListItem {...item} />
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

export default UnitList;
