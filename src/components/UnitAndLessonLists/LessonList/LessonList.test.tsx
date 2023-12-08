import { act } from "react-dom/test-utils";

import LessonList from ".";

import { mockPaginationProps } from "@/__tests__/__helpers__/mockPaginationProps";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonListingFixture from "@/node-lib/curriculum-api/fixtures/lessonListing.fixture";

const render = renderWithProviders();

const { lessons, ...unit } = lessonListingFixture();
const lessonsWithUnitData = lessons.map((lesson) => ({
  ...lesson,
  ...unit,
}));

const onClick = jest.fn();

describe("components/ Lesson List", () => {
  test("it renders the list items", () => {
    const { getByRole } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h2"}
        currentPageItems={lessonsWithUnitData}
        unitTitle={"Unit title"}
        lessonCount={lessons.length}
        onClick={onClick}
      />,
    );

    const listHeading = getByRole("heading", { level: 2 });

    expect(listHeading).toBeInTheDocument();
  });
  test("it renders pagination if lesson count is greater than 5 ", () => {
    const { getByTestId } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h2"}
        currentPageItems={lessonsWithUnitData}
        unitTitle={"Unit title"}
        lessonCount={10}
        onClick={onClick}
      />,
    );

    const pagination = getByTestId("pagination");

    expect(pagination).toBeInTheDocument();
  });
  test("it does not renders pagination if lesson count is less than 5 ", () => {
    const { queryByTestId } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h2"}
        currentPageItems={lessonsWithUnitData}
        unitTitle={"Unit title"}
        lessonCount={4}
        onClick={onClick}
      />,
    );

    const pagination = queryByTestId("pagination");

    expect(pagination).not.toBeInTheDocument();
  });
  test("onClick is called when a unit is clicked", () => {
    const { getByText } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h2"}
        currentPageItems={lessonsWithUnitData}
        unitTitle={"Unit title"}
        lessonCount={4}
        onClick={onClick}
      />,
    );
    const unit = getByText("Add two surds");

    act(() => {
      unit.click();
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
