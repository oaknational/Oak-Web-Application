import { act, screen } from "@testing-library/react";

import TopNav, { TopNavProps } from "./TopNav";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

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

describe("TopNav", () => {
  it("renders links for pupils and teachers", async () => {
    renderWithTheme(<TopNav {...mockProps} />);
    const teachersLink = await screen.findByRole("link", { name: "Teachers" });
    expect(teachersLink).toBeInTheDocument();

    const pupilsLink = screen.getByRole("link", { name: "Go to pupils" });
    expect(pupilsLink).toBeInTheDocument();
  });
  it("renders active tab with the correct style", async () => {
    renderWithTheme(<TopNav {...mockProps} />);

    const teachersLink = await screen.findByRole("link", { name: "Teachers" });
    expect(teachersLink).toBeInTheDocument();
    expect(teachersLink).toHaveStyle({ background: "rgb(255, 255, 255)" });

    const pupilsLink = screen.getByRole("link", { name: "Go to pupils" });
    expect(pupilsLink).toBeInTheDocument();
    expect(pupilsLink).toHaveStyle({ background: "rgb(34,34,34)" });
  });
  it("renders the correct subnav for teachers", async () => {
    renderWithTheme(<TopNav {...mockProps} />);

    const teachersSubnav = await screen.findByTestId("teachers-subnav");
    expect(teachersSubnav).toBeInTheDocument();
  });
  it("renders the correct subnav for pupils", async () => {
    mockSelectedArea.mockReturnValue("PUPILS");
    renderWithTheme(<TopNav {...mockProps} />);

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
    renderWithTheme(<TopNav {...mockProps} />);
    const skipButtonLink = screen.getByText("Skip to content").closest("a");

    if (!skipButtonLink) {
      throw new Error("Could not find skip link");
    }

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
    renderWithTheme(<TopNav teachers={null} pupils={null} />);
    const primaryButton = screen.queryByRole("button", { name: "Primary" });
    expect(primaryButton).not.toBeInTheDocument();

    const secondaryButton = screen.queryByRole("button", { name: "Secondary" });
    expect(secondaryButton).not.toBeInTheDocument();
  });
});
