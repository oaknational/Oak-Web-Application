import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import specialistLessonOverviewFixture from "./SpecialistLesson.fixture";
import SpecialistLesson from "./SpecialistLesson.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SpecialistLessonDownloads", () => {
  it("renders component", () => {
    const { getByText } = render(
      <SpecialistLesson curriculumData={specialistLessonOverviewFixture()} />,
    );
    const title = getByText("Specialist subject");

    expect(title).toBeInTheDocument();
  });

  it("renders with the correct resources", () => {
    render(
      <SpecialistLesson curriculumData={specialistLessonOverviewFixture()} />,
    );

    const slideDeck = screen.getAllByText("Slide deck");
    const lessonDetails = screen.getAllByText("Lesson details");

    expect(slideDeck).toHaveLength(2);
    expect(lessonDetails).toHaveLength(2);
  });
});
