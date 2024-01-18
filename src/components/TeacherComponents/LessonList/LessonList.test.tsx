import { describe, expect, it } from "vitest";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

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

const onClick = vi.fn();

describe("components/ Lesson List", () => {
  it("it renders the list items", () => {
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
  it("it renders pagination if lesson count is greater than 5 ", () => {
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
  it("it does not renders pagination if lesson count is less than 5 ", () => {
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
  it("onClick is called when a unit is clicked", async () => {
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

    await act(async () => {
      await userEvent.click(unit);
    });

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
