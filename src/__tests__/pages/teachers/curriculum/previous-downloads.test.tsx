import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CurriculumPreviousDownloadsPage from "@/pages/teachers/curriculum/previous-downloads";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("CurriculumPreviousDownloadsPage", () => {
  beforeEach(() => {
    window.location.hash = "";
    render(<CurriculumPreviousDownloadsPage />);
  });

  it("renders the correct tab based on the location hash", async () => {
    // Has the correct tab based on the location hash
    window.location.hash = "#KS3";
    waitFor(async () => {
      const heading = screen.getByTestId("heading");
      expect(heading).toHaveTextContent("KS3");
    });
  });

  it("renders the heading and description", () => {
    // Has the correct heading
    expect(screen.getByTestId("heading")).toHaveTextContent(
      "Previously released curricula",
    );
    // Has the correct description
    expect(screen.getByTestId("description")).toBeInTheDocument();
  });

  it("renders the breadcrumbs", async () => {
    // Has breadcrumbs with 3 links
    waitFor(async () => {
      const breadcrumbs = screen.getByTestId("breadcrumbs");
      const linkItems = breadcrumbs.querySelectorAll("li");
      expect(linkItems.length).toBe(3);
    });
  });

  it("renders the dropdown navigation for mobile", () => {
    // Has the dropdown navigation
    const dropdownNav = screen.getByTestId("dropdownNav");
    expect(dropdownNav).toBeInTheDocument();
  });

  it("renders tab navigation for desktop", () => {
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
    // Has the downloadable documents
    waitFor(async () => {
      const cards = screen.getAllByTestId("downloadCard");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  it("allows user to select a card and clears selection on navigation", async () => {
    // Allows user to navigate to new tab
    waitFor(async () => {
      const card = screen.getAllByTestId("downloadCard")[0];
      if (card === undefined) {
        throw new Error("No cards found");
      }
      userEvent.click(card);
      waitFor(async () => {
        const input = card.querySelector("input") as HTMLInputElement;
        expect(input?.checked).toBeTruthy();
        const link = screen
          .getAllByTestId("tabularNav")[0]
          ?.querySelector('a[text="KS2"]');
        if (!link) {
          throw new Error("Link not found");
        }
        userEvent.click(link);
        waitFor(async () => {
          const heading = screen.getByTestId("heading");
          expect(heading).toHaveTextContent("KS2");
          expect(
            screen
              .getByTestId("downloadCardsContainer")
              .querySelector("input:checked"),
          ).toBeNull();
        });
      });
    });
  });
});
