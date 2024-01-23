import specialistLessonListingFixture from "./SpecialistLessonListing.fixture";
import SpecialistLessonListing from "./SpecialistLessonListing.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SpecialistUnitListing", () => {
  test("renders component", () => {
    const { getByTestId } = render(
      <SpecialistLessonListing
        curriculumData={specialistLessonListingFixture()}
      />,
    );
    const lessonGrid = getByTestId("specialist-lesson-grid");

    expect(lessonGrid).toBeInTheDocument();
  });

  test("specialist lesson list", () => {
    const { getAllByTestId } = render(
      <SpecialistLessonListing
        curriculumData={specialistLessonListingFixture()}
      />,
    );
    const unitListItems = getAllByTestId("lesson-list-item");
    expect(unitListItems).toHaveLength(3);
  });
});
