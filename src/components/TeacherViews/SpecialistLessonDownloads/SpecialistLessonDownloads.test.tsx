import specialistLessonDownloadsFixtures from "./SpecialistLessonDownloads.fixture";
import SpecialistLessonDownloads from "./SpecialistLessonDownloads.view";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("SpecialistLessonDownloads", () => {
  test("renders component", () => {
    const { getByText } = render(
      <SpecialistLessonDownloads
        curriculumData={specialistLessonDownloadsFixtures()}
      />,
    );
    const lessonDownloads = getByText("Lesson resources");

    expect(lessonDownloads).toBeInTheDocument();
  });

  test("renders with the correct resources to download", () => {
    const { getAllByTestId, getByText } = render(
      <SpecialistLessonDownloads
        curriculumData={specialistLessonDownloadsFixtures()}
      />,
    );

    const resources = getAllByTestId("resourceCard");

    expect(resources).toHaveLength(4);

    expect(getByText("Worksheet")).toBeInTheDocument();
    expect(getByText("Lesson slides")).toBeInTheDocument();
    expect(getByText("Exit quiz questions")).toBeInTheDocument();
    expect(getByText("Exit quiz answers")).toBeInTheDocument();
  });
});
