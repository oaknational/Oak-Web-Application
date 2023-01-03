import teachersKeyStageSubjectUnitsLessonsFixture from "../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnitLessons.fixture";
import LessonListPage from "../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units/[unitSlug]";
import renderWithProviders from "../../../../../__helpers__/renderWithProviders";

describe("Lesson listing page", () => {
  test("it renders the unit title as page title", () => {
    const { getByRole } = renderWithProviders(
      <LessonListPage
        curriculumData={teachersKeyStageSubjectUnitsLessonsFixture()}
      />
    );

    const pageHeading = getByRole("heading", { level: 1 });

    expect(pageHeading).toBeInTheDocument();
  });

  test("it renders the correct number of lessons", () => {
    const { getByText } = renderWithProviders(
      <LessonListPage
        curriculumData={teachersKeyStageSubjectUnitsLessonsFixture()}
      />
    );

    const lessonCount = getByText("Lessons (2)");

    expect(lessonCount).toBeInTheDocument();
  });
});
