import LessonOverviewCanonicalPage from "@/pages/teachers/lessons/[lessonSlug]";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonOverviewFixture from "@/node-lib/curriculum-api/fixtures/lessonOverview.fixture";

const render = renderWithProviders();

const lesson = lessonOverviewFixture({
  lessonTitle: "The meaning of time",
});
describe("LessonOverviewCanonicalPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <LessonOverviewCanonicalPage lesson={{ ...lesson, pathways: [] }} />,
    );

    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent(
      lesson.lessonTitle,
    );
  });
});
