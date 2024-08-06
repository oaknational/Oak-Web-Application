import { FC } from "react";
import {
  OakHeading,
  OakUL,
  OakHeadingTag,
  OakFlex,
  OakPagination,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";

import LessonListItem, {
  LessonListItemProps,
} from "@/components/TeacherComponents/LessonListItem";
import Box from "@/components/SharedComponents/Box";
import {
  UsePaginationProps,
  PaginationProps,
} from "@/components/SharedComponents/Pagination/usePagination";
import { SpecialistLessonListItemProps } from "@/components/TeacherComponents/LessonListItem/LessonListItem";
import { SpecialistLesson } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";

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
  const { currentPage, pageSize, firstItemRef, paginationRoute } =
    paginationProps;

  const router = useRouter();

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
              <LessonListItem
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
        <Box
          $width="100%"
          $mt={[0, "auto"]}
          $pb={[30, 44]}
          $pt={[46, 36]}
          data-testid="pagination-box"
        >
          <OakPagination
            {...paginationProps}
            initialPage={currentPage}
            onPageChange={(page: number) => {
              router
                .push(
                  {
                    pathname: paginationRoute,
                    query: { page },
                  },
                  undefined,
                  { shallow: true, scroll: false },
                )
                .then(() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                });
            }}
            pageName={unitTitle}
            paginationHref={paginationRoute}
          />
        </Box>
      ) : (
        <Box $pb={32} />
      )}
    </OakFlex>
  );
};

export default LessonList;
