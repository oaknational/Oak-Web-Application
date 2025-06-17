import { screen } from "@testing-library/react";

import SpecialistLesson from "./SpecialistLesson.view";

import specialistLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonOverview.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SpecialistLessonDownloads", () => {
  test("renders component", () => {
    const { getAllByText, getByText } = render(
      <SpecialistLesson lesson={specialistLessonOverviewFixture()} />,
    );
    const title = getAllByText(specialistLessonOverviewFixture().lessonTitle);
    const unitTitle = getByText(
      "Communication and language - Applying learning",
    );

    expect(title[0]).toBeInTheDocument();
    expect(unitTitle).toBeInTheDocument();
  });

  test("renders with the correct resources", () => {
    render(<SpecialistLesson lesson={specialistLessonOverviewFixture()} />);

    const slideDeck = screen.getAllByText("Lesson slides");
    const lessonDetails = screen.getAllByText("Lesson details");

    expect(slideDeck).toHaveLength(2);
    expect(lessonDetails).toHaveLength(2);
  });
});
