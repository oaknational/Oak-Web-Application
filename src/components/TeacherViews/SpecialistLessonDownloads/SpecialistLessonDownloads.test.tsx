import specialistLessonDownloadsFixtures from "./SpecialistLessonDownloads.fixture";
import SpecialistLessonDownloads from "./SpecialistLessonDownloads.view";

import { mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();

describe("SpecialistLessonDownloads", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedOut);
  });
  test("renders component", () => {
    const { getByText } = render(
      <SpecialistLessonDownloads
        topNav={topNavFixture}
        curriculumData={specialistLessonDownloadsFixtures()}
      />,
    );
    const lessonDownloads = getByText("All resources selected");

    expect(lessonDownloads).toBeInTheDocument();
  });

  test("renders with the correct resources to download", () => {
    const { getAllByTestId, getByText, getAllByText } = render(
      <SpecialistLessonDownloads
        topNav={topNavFixture}
        curriculumData={specialistLessonDownloadsFixtures()}
      />,
    );

    const resources = getAllByTestId("resourceCard");

    expect(resources).toHaveLength(4);

    expect(getAllByText("Worksheet")[0]).toBeInTheDocument();
    expect(getByText("Lesson slides")).toBeInTheDocument();
    expect(getByText("Exit quiz questions")).toBeInTheDocument();
    expect(getByText("Exit quiz answers")).toBeInTheDocument();
  });
});
