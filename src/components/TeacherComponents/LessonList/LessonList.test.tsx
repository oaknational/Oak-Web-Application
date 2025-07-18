import userEvent from "@testing-library/user-event";

import LessonList from ".";

import { mockPaginationProps } from "@/__tests__/__helpers__/mockPaginationProps";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonListingFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";

const render = renderWithProviders();

const { lessons, ...unit } = lessonListingFixture();
const lessonsWithUnitData = lessons.map((lesson) => ({
  ...lesson,
  ...unit,
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockResolvedValue({ asPath: "" }),
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
        lessonCountHeader={`Lessons (${lessons.length})`}
        onClick={onClick}
      />,
    );

    const listHeading = getByRole("heading", { name: "Lessons (5)" });

    expect(listHeading).toBeInTheDocument();
  });
  test("it renders pagination if lesson count is greater than 20 ", () => {
    const { getByTestId } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h2"}
        currentPageItems={lessonsWithUnitData}
        unitTitle={"Unit title"}
        lessonCount={21}
        onClick={onClick}
        lessonCountHeader={`Lessons (${lessons.length})`}
      />,
    );

    const pagination = getByTestId("pagination");

    expect(pagination).toBeInTheDocument();
  });
  test("it does not renders pagination if lesson count is less than or equal to 20 ", () => {
    const { queryByTestId } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h2"}
        currentPageItems={lessonsWithUnitData}
        unitTitle={"Unit title"}
        lessonCount={20}
        onClick={onClick}
        lessonCountHeader={`Lessons (${lessons.length})`}
      />,
    );

    const pagination = queryByTestId("pagination");

    expect(pagination).not.toBeInTheDocument();
  });
  test("onClick is called when a unit is clicked", async () => {
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
        lessonCountHeader={`Lessons (${lessons.length})`}
      />,
    );
    const unit = getByText("Add two surds");

    await userEvent.click(unit);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test("it renders the SEO accordion for non-legacy units", async () => {
    const { getByTestId } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"ks2"}
        headingTag={"h2"}
        currentPageItems={lessonsWithUnitData}
        unitTitle={"Unit title"}
        lessonCount={4}
        onClick={onClick}
        lessonCountHeader={`Lessons (${lessons.length})`}
        programmeSlug="computing-primary-ks2"
        yearTitle="Year 6"
        subjectTitle="Computing"
      />,
    );
    const seoAccordion = getByTestId("lesson-list-seo-accordion");

    expect(seoAccordion).toBeInTheDocument();
  });
  test("it does not render the SEO accordion for legacy units", async () => {
    const { queryByTestId } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"ks2"}
        headingTag={"h2"}
        currentPageItems={lessonsWithUnitData}
        unitTitle={"Unit title"}
        lessonCount={4}
        onClick={onClick}
        lessonCountHeader={`Lessons (${lessons.length})`}
        programmeSlug="computing-primary-ks2-l"
        yearTitle="Year 6"
        subjectTitle="Computing"
      />,
    );
    const seoAccordion = queryByTestId("lesson-list-seo-accordion");

    expect(seoAccordion).not.toBeInTheDocument();
  });
});
