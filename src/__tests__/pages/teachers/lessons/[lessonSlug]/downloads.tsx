import LessonDownloadsCanonicalPage from "@/pages/teachers/lessons/[lessonSlug]/downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonDownloadsFixture from "@/node-lib/curriculum-api/fixtures/lessonDownloads.fixture";

const render = renderWithProviders();

const lesson = lessonDownloadsFixture({
  lessonTitle: "The meaning of time",
});
describe("LessonDownloadsCanonicalPage", () => {
  it("Renders title from the props", async () => {
    const result = render(
      <LessonDownloadsCanonicalPage
        curriculumData={{ ...lesson, pathways: [] }}
      />,
    );

    expect(result.queryByText("Downloads")).toBeInTheDocument();
  });
});
