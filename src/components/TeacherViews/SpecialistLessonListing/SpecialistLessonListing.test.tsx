import { within } from "@testing-library/dom";

import specialistLessonListingFixture from "./SpecialistLessonListing.fixture";
import SpecialistLessonListing from "./SpecialistLessonListing.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
const render = renderWithProviders();

jest.mock("@clerk/nextjs", () => ({
  __esModule: true,
  SignInButton: () => <button />,
  useUser: () => ({
    user: null,
    isLoaded: true,
    isSignedIn: false,
  }),
}));

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
    const { getByLabelText } = render(
      <SpecialistLessonListing
        curriculumData={specialistLessonListingFixture()}
      />,
    );
    const unitList = getByLabelText("A list of lessons");
    expect(unitList).toBeInTheDocument();

    const listItems = within(unitList).getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });
});
