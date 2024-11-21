import LessonMediaCanonicalPage from "@/pages/teachers/lessons/[lessonSlug]/media";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => true,
}));

describe("LessonMediaCanonicalPage", () => {
  it("Renders breadcrumbs", async () => {
    const result = render(<LessonMediaCanonicalPage />);

    expect(result.queryByText("Extra video and audio")).toBeInTheDocument();
  });
});
