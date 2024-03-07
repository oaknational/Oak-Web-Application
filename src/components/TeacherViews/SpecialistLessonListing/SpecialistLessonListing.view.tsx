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
  const { subjectSlug, subjectTitle, unitTitle, unitSlug, programmeTitle } =
    curriculumData;

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
              page: "specialist-programme-index",
              subjectSlug,
            },
            label: "Specialist programmes",
          },
          {
            oakLinkProps: {
              page: "specialist-unit-index",
              programmeSlug: unitSlug,
            },
            label: unitTitle,
          },
        ]}
        background={"pink30"}
        subjectIconBackgroundColor={"pink"}
        subjectSlug={unitSlug}
        subjectTitle={unitTitle}
        programmeFactor={programmeTitle}
        title={subjectTitle}
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
