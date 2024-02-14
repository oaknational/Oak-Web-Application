import { PupilExperienceView } from "./PupilExperience.view";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { pupilLessonOverviewFixture } from "@/node-lib/curriculum-api-2023/fixtures/pupilLessonOverview.fixture";
import { PupilLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonOverview/pupilLessonOverview.schema";

describe("PupilExperienceView", () => {
  const lessonData: PupilLessonOverviewPageData = pupilLessonOverviewFixture();

  it("should render", () => {
    const { getByText } = renderWithTheme(
      <PupilExperienceView curriculumData={lessonData} hasWorksheet={false} />,
    );

    expect(getByText(lessonData.lessonTitle)).toBeInTheDocument();
  });
});
