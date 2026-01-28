import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TopNav, { TopNavProps } from "./TopNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { OakNotificationsProvider } from "@/context/OakNotifications/OakNotificationsProvider";

const mockSelectedArea = jest.fn().mockReturnValue("TEACHERS");
jest.mock("@/hooks/useSelectedArea", () => ({
  __esModule: true,
  default: () => mockSelectedArea(),
}));

globalThis.matchMedia = jest.fn().mockReturnValue({
  matches: true,
});

const mockProps: TopNavProps = {
  teachers: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", keystages: [] },
    secondary: {
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      keystages: [],
    },
    aboutUs: [],
    guidance: [],
  },
  pupils: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", years: [] },
    secondary: { phaseSlug: "secondary", phaseTitle: "Secondary", years: [] },
  },
};

const TopNavWithProviders = (props: TopNavProps) => {
  return (
    <OakNotificationsProvider>
      <TopNav {...props} />
    </OakNotificationsProvider>
  );
};

describe("TopNav", () => {
  it("renders links for pupils and teachers", async () => {
    renderWithTheme(<TopNavWithProviders {...mockProps} />);
    const teachersLink = await screen.findByRole("link", { name: "Teachers" });
    expect(teachersLink).toBeInTheDocument();

    const pupilsLink = screen.getByRole("link", { name: "Go to pupils" });
    expect(pupilsLink).toBeInTheDocument();
  });
  it("renders active tab with the correct style", async () => {
    renderWithTheme(<TopNavWithProviders {...mockProps} />);

    const teachersLink = await screen.findByRole("link", { name: "Teachers" });
    expect(teachersLink).toBeInTheDocument();
    expect(teachersLink).toHaveStyle({ background: "rgb(255, 255, 255)" });

    const pupilsLink = screen.getByRole("link", { name: "Go to pupils" });
    expect(pupilsLink).toBeInTheDocument();
    expect(pupilsLink).toHaveStyle({ background: "rgb(34,34,34)" });
  });
  it("renders the correct subnav for teachers", async () => {
    renderWithTheme(<TopNavWithProviders {...mockProps} />);

    const teachersSubnav = await screen.findByTestId("teachers-subnav");
    expect(teachersSubnav).toBeInTheDocument();
  });
  it("renders the correct subnav for pupils", async () => {
    mockSelectedArea.mockReturnValue("PUPILS");
    renderWithTheme(<TopNavWithProviders {...mockProps} />);

    const teachersLink = await screen.findByRole("link", {
      name: "Go to teachers",
    });
    expect(teachersLink).toBeInTheDocument();

    const pupilsLink = screen.getByRole("link", { name: "Pupils" });
    expect(pupilsLink).toBeInTheDocument();
    const pupilsSubnav = await screen.findByTestId("pupils-subnav");
    expect(pupilsSubnav).toBeInTheDocument();
  });
  it("renders a hidden skip to content button until focused", () => {
    renderWithTheme(<TopNavWithProviders {...mockProps} />);
    const skipButtonLink = screen.getByText("Skip to content").closest("a");

    if (!skipButtonLink) {
      throw new Error("Could not find skip link");
    }

    expect(skipButtonLink).not.toHaveFocus();
    expect(skipButtonLink).toHaveStyle("position: absolute");

    act(() => {
      skipButtonLink.focus();
    });
    expect(skipButtonLink).toHaveFocus();
    expect(skipButtonLink).not.toHaveStyle("position: absolute");

    act(() => {
      skipButtonLink.blur();
    });
    expect(skipButtonLink).not.toHaveFocus();
  });
  it("renders an empty subnav when data is null", async () => {
    renderWithTheme(<TopNavWithProviders teachers={null} pupils={null} />);
    const primaryButton = screen.queryByRole("button", { name: "Primary" });
    expect(primaryButton).not.toBeInTheDocument();

    const secondaryButton = screen.queryByRole("button", { name: "Secondary" });
    expect(secondaryButton).not.toBeInTheDocument();
  });
  it("renders dropdown when a subnav button is clicked", async () => {
    renderWithTheme(<TopNavWithProviders {...mockProps} />);
    const primaryButton = await screen.findByText("Primary");
    act(() => {
      primaryButton.click();
    });

    const dropdown = await screen.findByTestId("topnav-dropdown-container");
    expect(dropdown).toBeInTheDocument();
  });
  it("closes dropdown when dropdown is open and active subnav button is clicked", async () => {
    renderWithTheme(<TopNavWithProviders {...mockProps} />);
    const primaryButton = await screen.findByText("Primary");
    act(() => {
      primaryButton.click();
    });

    const dropdown = await screen.findByTestId("topnav-dropdown-container");
    expect(dropdown).toBeInTheDocument();

    act(() => {
      primaryButton.click();
    });

    waitFor(() => expect(dropdown).not.toBeInTheDocument());
  });
  it("closes dropdown when escape key is pressed", async () => {
    const user = userEvent.setup();
    renderWithTheme(<TopNavWithProviders {...mockProps} />);
    const primaryButton = await screen.findByText("Primary");
    act(() => {
      primaryButton.click();
    });

    const dropdown = await screen.findByTestId("topnav-dropdown-container");
    expect(dropdown).toBeInTheDocument();

    act(() => {
      user.keyboard("{Escape}");
    });

    expect(dropdown).not.toBeVisible();
  });
});
