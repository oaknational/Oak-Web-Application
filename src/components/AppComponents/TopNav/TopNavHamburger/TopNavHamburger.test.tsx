import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TopNavProps } from "../TopNav";

import { TopNavHamburger } from "./TopNavHamburger";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const mockProps: TopNavProps = topNavFixture;

describe("TopNavHamburger", () => {
  beforeEach(() => {
    // Mock matchMedia for responsive tests
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("renders a hamburger button", () => {
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    expect(hamburgerButton).toBeInTheDocument();
  });

  it("does not show modal initially", () => {
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    expect(screen.queryByText("Primary")).not.toBeInTheDocument();
    expect(screen.queryByText("Secondary")).not.toBeInTheDocument();
  });

  it("opens modal when hamburger button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.getByText("Secondary")).toBeInTheDocument();
    });
  });

  it("displays main menu content when modal is opened", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("KS1")).toBeInTheDocument();
      expect(screen.getByText("KS2")).toBeInTheDocument();
      expect(screen.getByText("EYFS")).toBeInTheDocument();
      expect(screen.getByText("KS3")).toBeInTheDocument();
      expect(screen.getByText("KS4")).toBeInTheDocument();
      expect(screen.getByText("Curriculum")).toBeInTheDocument();
      expect(screen.getByText("About us")).toBeInTheDocument();
      expect(screen.getByText("Guidance")).toBeInTheDocument();
    });
  });

  it("opens submenu when a keystage button is clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("KS1")).toBeInTheDocument();
    });

    const ks1Button = screen.getByRole("button", { name: "KS1" });
    await user.click(ks1Button);

    await waitFor(() => {
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Maths")).toBeInTheDocument();
    });
  });

  it("navigates back to main menu from submenu", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("KS1")).toBeInTheDocument();
    });

    const ks1Button = screen.getByRole("button", { name: "KS1" });
    await user.click(ks1Button);

    await waitFor(() => {
      expect(screen.getByText("English")).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", { name: "KS1" });
    await user.click(backButton);

    await waitFor(() => {
      expect(screen.getByText("Primary")).toBeInTheDocument();
      expect(screen.queryByText("English")).not.toBeInTheDocument();
    });
  });

  it("opens About us submenu and displays links", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("About us")).toBeInTheDocument();
    });

    const aboutUsButton = screen.getByRole("button", { name: "About us" });
    await user.click(aboutUsButton);

    await waitFor(() => {
      expect(screen.getByText("Who we are")).toBeInTheDocument();
      expect(screen.getByText("Our mission")).toBeInTheDocument();
    });
  });

  it("opens Guidance submenu and displays links", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("Guidance")).toBeInTheDocument();
    });

    const guidanceButton = screen.getByRole("button", { name: "Guidance" });
    await user.click(guidanceButton);

    await waitFor(() => {
      expect(screen.getByText("Teaching tips")).toBeInTheDocument();
      expect(screen.getByText("Safeguarding")).toBeInTheDocument();
    });
  });

  it("displays all subjects in KS2 submenu", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("KS2")).toBeInTheDocument();
    });

    const ks2Button = screen.getByRole("button", { name: "KS2" });
    await user.click(ks2Button);

    await waitFor(() => {
      expect(screen.getByText("Science")).toBeInTheDocument();
      expect(screen.getByText("All KS2 subjects")).toBeInTheDocument();
    });
  });

  it("displays subjects for secondary keystages", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("KS3")).toBeInTheDocument();
    });

    const ks3Button = screen.getByRole("button", { name: "KS3" });
    await user.click(ks3Button);

    await waitFor(() => {
      expect(screen.getByText("History")).toBeInTheDocument();
      expect(screen.getByText("All KS3 subjects")).toBeInTheDocument();
    });
  });

  it("focuses on the previous submenu button when returning to main menu", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("KS4")).toBeInTheDocument();
    });

    const ks4Button = screen.getByRole("button", { name: "KS4" });
    await user.click(ks4Button);

    await waitFor(() => {
      expect(screen.getByText("Geography")).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", { name: "KS4" });
    await user.click(backButton);

    await waitFor(() => {
      const ks4MainButton = screen.getByRole("button", { name: "KS4" });
      expect(ks4MainButton).toHaveFocus();
    });
  });

  it("displays 'All subjects' link for each keystage", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavHamburger {...mockProps} />);

    const hamburgerButton = screen.getByRole("button");
    await user.click(hamburgerButton);

    await waitFor(() => {
      expect(screen.getByText("KS1")).toBeInTheDocument();
    });

    const ks1Button = screen.getByRole("button", { name: "KS1" });
    await user.click(ks1Button);

    await waitFor(() => {
      const allSubjectsLink = screen.getByRole("link", {
        name: "All KS1 subjects",
      });
      expect(allSubjectsLink).toBeInTheDocument();
      expect(allSubjectsLink).toHaveAttribute(
        "href",
        "/teachers/key-stages/ks1/subjects",
      );
    });
  });
});
