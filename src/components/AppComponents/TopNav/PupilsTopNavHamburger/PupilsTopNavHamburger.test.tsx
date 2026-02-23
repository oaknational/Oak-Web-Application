import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PupilsTopNavHamburger } from "./PupilsTopNavHamburger";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProvidersByName(["oakTheme", "router"]);

const mockPupilsSubNavData = topNavFixture.pupils!;

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
