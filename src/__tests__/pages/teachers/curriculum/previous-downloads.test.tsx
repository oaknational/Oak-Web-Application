import { screen, waitFor } from "@testing-library/react";

import CurriculumPreviousDownloadsPage from "@/pages/teachers/curriculum/previous-downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("CurriculumPreviousDownloadsPage", () => {
  it("renders the heading and description", () => {
    render(<CurriculumPreviousDownloadsPage />);
    // Has the correct heading
    expect(screen.getByTestId("heading")).toHaveTextContent(
      "Previously released curricula",
    );
    // Has the correct description
    expect(screen.getByTestId("description")).toBeInTheDocument();
  });

  it("renders the breadcrumbs", async () => {
    render(<CurriculumPreviousDownloadsPage />);
    // Has breadcrumbs with 3 links
    waitFor(async () => {
      const breadcrumbs = screen.getByTestId("breadcrumbs");
      const linkItems = breadcrumbs.querySelectorAll("li");
      expect(linkItems.length).toBe(3);
    });
  });

  it("renders the dropdown navigation for mobile", () => {
    render(<CurriculumPreviousDownloadsPage />);
    // Has the dropdown navigation
    const dropdownNav = screen.getByTestId("dropdownNav");
    expect(dropdownNav).toBeInTheDocument();
  });

  it("renders tab navigation for desktop", () => {
    render(<CurriculumPreviousDownloadsPage />);
    // Has the tab navigation
    const tabularNav = screen.getByTestId("tabularNav");
    expect(tabularNav).toBeInTheDocument();

    const tabItems = tabularNav.querySelectorAll("a");
    ["EYFS", "KS1", "KS2", "KS3", "KS4", "Specialist", "Therapies"].forEach(
      (key, index) => {
        expect(tabItems[index]).toHaveTextContent(key);
      },
    );
  });

  it("renders the downloadable curriculum document cards", async () => {
    render(<CurriculumPreviousDownloadsPage />);
    // Has the downloadable documents
    waitFor(async () => {
      const cards = screen.getAllByTestId("downloadCard");
      expect(cards.length).toBeGreaterThan(0);
    });
  });
});
