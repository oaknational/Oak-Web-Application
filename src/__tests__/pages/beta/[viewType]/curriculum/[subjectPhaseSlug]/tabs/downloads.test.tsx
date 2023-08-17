import DownloadsTab from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/tabs/downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
const render = renderWithProviders();

describe("curriculum download page", () => {
  describe("components rendering on page", () => {
    it("renders overview headings", () => {
      const data = {
        urls: ["/placeholder-download-url"],
      };
      const subject = {
        title: "Maths",
        slug: "maths",
      };
      const phase = {
        title: "Primary",
        slug: "primary",
      };
      const { queryByTestId } = render(
        <DownloadsTab data={data} subject={subject} phase={phase} />
      );

      expect(queryByTestId("heading")).toBeInTheDocument();
    });
  });
});
