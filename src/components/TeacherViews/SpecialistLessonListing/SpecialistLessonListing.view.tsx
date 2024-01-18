import { FC } from "react";

import MaxWidth from "@/components/SharedComponents/MaxWidth";
import LessonList from "@/components/TeacherComponents/LessonList";
import usePagination from "@/components/SharedComponents/Pagination/usePagination";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import HeaderListing from "@/components/TeacherComponents/HeaderListing";
import { RESULTS_PER_PAGE } from "@/utils/resultsPerPage";

type SpecialistLessonListingProps = {
  curriculumData: SpecialistLessonListingData;
};

export type SpecialistLessonListingData = {
  lessons: SpecialistLesson[];
  programmeSlug: string;
  programmeTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  unitSlug: string;
  unitTitle: string;
};

export type SpecialistLesson = {
  lessonSlug: string;
  lessonTitle: string;
  subjectSlug: string;
  subjectTitle: string;
  unitSlug: string;
  programmeSlug: string;
  programmeTitle: string;
  description: string;
  expired: boolean;
  pupilLessonOutcome?: string | null;
  quizCount?: number | null;
  videoCount?: number | null;
  presentationCount?: number | null;
  worksheetCount?: number | null;
  hasCurriculumDownload?: boolean | null;
  orderInUnit?: number | null;
  hasCopyrightMaterial?: boolean | null;
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
      />
      <MaxWidth $ph={16}>
        <Grid data-testid="specialist-lesson-grid">
          <GridArea $colSpan={[12, 9]} $mt={[16, 32]}>
            <LessonList
              {...curriculumData}
              lessonCount={lessons.length}
              currentPageItems={currentPageItems}
              paginationProps={paginationProps}
              headingTag={"h2"}
              unitTitle={unitTitle}
              onClick={() => {}}
            />
          </GridArea>
        </Grid>
      </MaxWidth>
    </>
  );
};

export default SpecialistLessonListing;
