import { screen } from "@testing-library/react";

import SpecialistLesson from "./SpecialistLesson.view";

import specialistLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/specialistLessonOverview.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SpecialistLessonDownloads", () => {
  test("renders component", () => {
    const { getByText } = render(
      <SpecialistLesson lesson={specialistLessonOverviewFixture()} />,
    );
    const title = getByText("Communication and language - Applying learning");

    expect(title).toBeInTheDocument();
  });

  test("renders with the correct resources", () => {
    render(<SpecialistLesson lesson={specialistLessonOverviewFixture()} />);

    const slideDeck = screen.getAllByText("Slide deck");
    const lessonDetails = screen.getAllByText("Lesson details");

    expect(slideDeck).toHaveLength(2);
    expect(lessonDetails).toHaveLength(2);
  });
});
