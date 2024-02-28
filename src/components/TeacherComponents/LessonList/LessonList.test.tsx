import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";

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

const expiredLesson = [
  {
    expired: true,
    lessonSlug: "new-lesson-test",
    lessonTitle: "New Lesson test",
    description: "Test for a lesson that is expired",
    quizCount: 2,
    videoCount: 1,
    presentationCount: 1,
    worksheetCount: 1,
    hasCopyrightMaterial: false,
    orderInUnit: 5,
    ...unit,
  },
];

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
        isNew={false}
      />,
    );

    const listHeading = getByRole("heading", { level: 2 });

    expect(listHeading).toBeInTheDocument();
  });

  test("it renders coming soon component with a new and expired lesson", () => {
    const { getAllByRole } = render(
      <LessonList
        paginationProps={mockPaginationProps}
        subjectSlug={"computing"}
        keyStageSlug={"2"}
        headingTag={"h2"}
        currentPageItems={expiredLesson}
        unitTitle={"Unit title"}
        lessonCount={lessons.length}
        onClick={onClick}
        isNew={true}
      />,
    );
    const comingSoonLI = getAllByRole("listitem")[5];

    if (comingSoonLI) {
      const comingSoonText =
        within(comingSoonLI).getByTestId("coming-soon").textContent;
      expect(comingSoonText).toBe("Coming Soon!");
    }
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
        isNew={false}
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
        isNew={false}
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
        isNew={false}
      />,
    );
    const unit = getByText("Add two surds");

    await userEvent.click(unit);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
