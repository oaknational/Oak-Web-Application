import { describe, it, expect } from "vitest";

import specialistLessonDownloadsFixtures from "./SpecialistLessonDownloads.fixture";
import SpecialistLessonDownloads from "./SpecialistLessonDownloads.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SpecialistLessonDownloads", () => {
  it("renders component", () => {
    const { getByText } = render(
      <SpecialistLessonDownloads
        curriculumData={specialistLessonDownloadsFixtures()}
      />,
    );
    const lessonDownloads = getByText("Lesson resources");

    expect(lessonDownloads).toBeInTheDocument();
  });

  it("renders with the correct resources to download", () => {
    const { getAllByTestId, getByText } = render(
      <SpecialistLessonDownloads
        curriculumData={specialistLessonDownloadsFixtures()}
      />,
    );

    const resources = getAllByTestId("lessonResourcesCheckbox");

    expect(resources).toHaveLength(4);

    expect(getByText("Worksheet")).toBeInTheDocument();
    expect(getByText("Presentation")).toBeInTheDocument();
    expect(getByText("Exit quiz questions")).toBeInTheDocument();
    expect(getByText("Exit quiz answers")).toBeInTheDocument();
  });
});
