import LessonMediaCanonicalPage from "@/pages/teachers/lessons/[lessonSlug]/media";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

const fixtureData = {
  lessonSlug: "lesson-slug",
  lessonTitle: "Lesson title",

  pathways: [
    {
      programmeSlug: "physical-education-ks4",
      lessonSlug: "running-and-jumping",
      lessonTitle: "Running and jumping",
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      unitSlug: "running-and-jumping",
      unitTitle: "Running and jumping",
      subjectSlug: "physical-education",
      subjectTitle: "Physical Education",
    },
  ],
};

describe("LessonMediaCanonicalPage", () => {
  it("Renders breadcrumbs", async () => {
    const result = render(
      <LessonMediaCanonicalPage curriculumData={fixtureData} />,
    );

    expect(result.queryByText("Extra video and audio")).toBeInTheDocument();
  });
});
