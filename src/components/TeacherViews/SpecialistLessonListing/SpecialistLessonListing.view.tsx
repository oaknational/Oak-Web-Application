import { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import MaxWidth from "@/components/SharedComponents/MaxWidth";
import LessonList from "@/components/TeacherComponents/LessonList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import HeaderListing from "@/components/TeacherComponents/HeaderListing";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";
import { SpecialistLessonListingData } from "@/node-lib/curriculum-api-2023/queries/specialistLessonListing/specialistLessonListing.schema";

type SpecialistLessonListingProps = {
  curriculumData: SpecialistLessonListingData;
};

function getHydratedLessonsFromUnit(unit: SpecialistLessonListingData) {
  const { lessons, ...rest } = unit;
  return lessons.map((lesson) => ({
    ...lesson,
    ...rest,
  }));
}

const SpecialistLessonListing: FC<SpecialistLessonListingProps> = ({
  curriculumData,
}) => {
  const {
    subjectSlug,
    subjectTitle,
    unitTitle,
    programmeTitle,
    programmeSlug,
    unitSlug,
  } = curriculumData;

  const lessons = getHydratedLessonsFromUnit(curriculumData);

  const paginationProps = usePagination({
    totalResults: lessons.length,
    pageSize: RESULTS_PER_PAGE,
    items: lessons,
  });

  const { currentPageItems } = paginationProps;

  return (
    <>
      <HeaderListing
        breadcrumbs={[
          {
            oakLinkProps: { page: "home" },
            label: "Home",
          },
          {
            oakLinkProps: {
              page: "specialist-subject-index",
            },
            label: "Specialist and therapies",
          },
          {
            oakLinkProps: {
              page: "specialist-unit-index",
              programmeSlug,
            },
            label: programmeTitle,
          },
          {
            oakLinkProps: {
              page: "specialist-lesson-index",
              programmeSlug,
              unitSlug,
            },
            label: unitTitle,
            disabled: true,
          },
        ]}
        background={"pink30"}
        subjectIconBackgroundColor={"pink"}
        subjectSlug={subjectSlug}
        subjectTitle={subjectTitle}
        programmeFactor={programmeTitle}
        title={unitTitle}
        isNew={false}
      />
      <MaxWidth $ph={16}>
        <OakGrid data-testid="specialist-lesson-grid">
          <OakGridArea
            $colSpan={[12, 9]}
            $mt={["space-between-s", "space-between-m2"]}
          >
            <LessonList
              {...curriculumData}
              lessonCount={lessons.length}
              currentPageItems={currentPageItems}
              paginationProps={paginationProps}
              headingTag={"h2"}
              unitTitle={unitTitle}
              // TODO: implement new avo tracking function when available
              onClick={() => {}}
            />
          </OakGridArea>
        </OakGrid>
      </MaxWidth>
    </>
  );
};

export default SpecialistLessonListing;
