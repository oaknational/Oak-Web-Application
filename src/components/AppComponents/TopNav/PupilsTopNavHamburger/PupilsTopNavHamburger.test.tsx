import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PupilsTopNavHamburger } from "./PupilsTopNavHamburger";

import { PupilsSubNavData } from "@/node-lib/curriculum-api-2023/queries/topNav/topNav.schema";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme", "router"]);

const mockPupilsSubNavData: PupilsSubNavData = {
  primary: {
    phaseTitle: "Primary",
    phaseSlug: "primary",
    years: [
      { title: "Year 1", slug: "year-1" },
      { title: "Year 2", slug: "year-2" },
      { title: "Year 3", slug: "year-3" },
      { title: "Year 4", slug: "year-4" },
      { title: "Year 5", slug: "year-5" },
      { title: "Year 6", slug: "year-6" },
    ],
  },
  secondary: {
    phaseTitle: "Secondary",
    phaseSlug: "secondary",
    years: [
      { title: "Year 7", slug: "year-7" },
      { title: "Year 8", slug: "year-8" },
      { title: "Year 9", slug: "year-9" },
      { title: "Year 10", slug: "year-10" },
      { title: "Year 11", slug: "year-11" },
    ],
  },
};

describe("PupilsTopNavHamburger", () => {
  it("should render the hamburger button", () => {
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    expect(hamburgerButton).toBeInTheDocument();
  });

  it("should render both Primary and Secondary sections in the modal", async () => {
    const user = userEvent.setup();
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    await user.click(hamburgerButton);

    expect(screen.getByText("Primary")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
  });

  it("should render all primary year buttons (Year 1-6)", async () => {
    const user = userEvent.setup();
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    await user.click(hamburgerButton);

    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Year ${i}`)).toBeInTheDocument();
    }
  });

  it("should render all secondary year buttons (Year 7-11)", async () => {
    const user = userEvent.setup();
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    await user.click(hamburgerButton);

    for (let i = 7; i <= 11; i++) {
      const yearButton = screen.getByText(`Year ${i}`);
      expect(yearButton).toBeInTheDocument();
      expect(yearButton.closest("a")).toBeTruthy();
    }
  });

  it("should have correct href for year buttons", async () => {
    const user = userEvent.setup();
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    await user.click(hamburgerButton);

    const year1Button = screen.getByText("Year 1").closest("a");
    expect(year1Button).toHaveAttribute(
      "href",
      "/pupils/years/year-1/subjects",
    );

    const year7Button = screen.getByText("Year 7").closest("a");
    expect(year7Button).toHaveAttribute(
      "href",
      "/pupils/years/year-7/subjects",
    );
  });

  it("should close the modal when a year button is clicked", async () => {
    const user = userEvent.setup();
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    await user.click(hamburgerButton);

    expect(screen.getByText("Primary")).toBeInTheDocument();

    const year1Button = screen.getByText("Year 1");

    await user.click(year1Button);

    await waitFor(() => {
      expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    });
  });

  it('should render "Help using Oak" link', async () => {
    const user = userEvent.setup();
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    await user.click(hamburgerButton);

    expect(screen.getByText("Help using Oak")).toBeInTheDocument();
  });

  it('should have correct href for "Help using Oak" link', async () => {
    const user = userEvent.setup();
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    await user.click(hamburgerButton);

    const helpLink = screen.getByText("Help using Oak").closest("a");
    expect(helpLink).toHaveAttribute(
      "href",
      "https://support.thenational.academy",
    );
  });

  it('should render "Help using Oak" link with external icon', async () => {
    const user = userEvent.setup();
    render(<PupilsTopNavHamburger {...mockPupilsSubNavData} />);

    const hamburgerButton = screen.getByTestId(
      "pupils-top-nav-hamburger-button",
    );
    await user.click(hamburgerButton);

    // Modal should be open
    const helpLink = screen.getByText("Help using Oak").closest("a");
    expect(helpLink).toBeInTheDocument();
    expect(helpLink).toHaveAttribute(
      "href",
      "https://support.thenational.academy",
    );
  });
});
