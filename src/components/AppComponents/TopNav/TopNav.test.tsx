import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TopNav from "./TopNav";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const render = renderWithProviders();
const mockSelectedArea = jest.fn().mockReturnValue("TEACHERS");
jest.mock("@/hooks/useSelectedArea", () => ({
  __esModule: true,
  default: () => mockSelectedArea(),
}));

globalThis.matchMedia = jest.fn().mockReturnValue({
  matches: false,
});

const mockProps = topNavFixture;

describe("TopNav", () => {
  it("renders links for pupils and teachers", async () => {
    render(<TopNav {...mockProps} />);
    const teachersLink = await screen.findByRole("link", { name: "Teachers" });
    expect(teachersLink).toBeInTheDocument();

    const pupilsLink = screen.getByRole("link", { name: "Go to pupils" });
    expect(pupilsLink).toBeInTheDocument();
  });
  it("renders active tab with the correct style", async () => {
    render(<TopNav {...mockProps} />);

    const teachersLink = await screen.findByRole("link", { name: "Teachers" });
    expect(teachersLink).toBeInTheDocument();
    expect(teachersLink).toHaveStyle({ background: "rgb(255, 255, 255)" });

    const pupilsLink = screen.getByRole("link", { name: "Go to pupils" });
    expect(pupilsLink).toBeInTheDocument();
    expect(pupilsLink).toHaveStyle({ background: "rgb(34,34,34)" });
  });
  it("renders the correct subnav for teachers", async () => {
    render(<TopNav {...mockProps} />);

    const teachersSubnav = await screen.findByTestId("teachers-subnav");
    expect(teachersSubnav).toBeInTheDocument();
  });
  it("renders the correct subnav for pupils", async () => {
    mockSelectedArea.mockReturnValue("PUPILS");
    render(<TopNav {...mockProps} />);

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
    render(<TopNav {...mockProps} />);
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
    render(<TopNav teachers={null} pupils={null} />);
    const primaryButton = screen.queryByRole("button", { name: "Primary" });
    expect(primaryButton).not.toBeInTheDocument();

    const secondaryButton = screen.queryByRole("button", { name: "Secondary" });
    expect(secondaryButton).not.toBeInTheDocument();
  });
  it("renders dropdown when a subnav button is clicked", async () => {
    render(<TopNav {...mockProps} />);
    const primaryButton = await screen.findByText("Primary");
    act(() => {
      primaryButton.click();
    });

    const dropdown = await screen.findByTestId("topnav-dropdown-container");
    expect(dropdown).toBeInTheDocument();
  });
  it("closes dropdown when dropdown is open and active subnav button is clicked", async () => {
    render(<TopNav {...mockProps} />);
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
    render(<TopNav {...mockProps} />);
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
const subnavLabels = [
  "Primary",
  "Secondary",
  "Curriculum",
  "Guidance",
  "About us",
];

describe("TopNav accessibility", () => {
  beforeEach(() => {
    mockSelectedArea.mockReturnValue("TEACHERS");
  });
  it("Tabs through navbar in correct order", async () => {
    const user = userEvent.setup();
    render(<TopNav {...mockProps} />);

    await user.tab();
    const skipLink = screen.getByText("Skip to content").closest("a");
    expect(skipLink).toHaveFocus();

    await user.tab();
    const teachersTab = screen.getByRole("link", {
      name: /Teachers/,
    });
    teachersTab.click();
    expect(teachersTab).toHaveFocus();

    await user.tab();
    const pupilsTab = screen.getByRole("link", { name: /Go to pupils/ });
    expect(pupilsTab).toHaveFocus();

    await user.tab();
    const homeLink = screen.getByLabelText("Home");
    expect(homeLink).toHaveFocus();

    for (const label of subnavLabels) {
      await user.tab();
      const subnavButton = screen.getByRole("button", { name: label });
      expect(subnavButton).toHaveFocus();
    }
  });
  it("Tabs through dropdown items when open", async () => {
    const user = userEvent.setup();
    render(<TopNav {...mockProps} />);

    const secondaryButton = await screen.findByRole("button", {
      name: "Secondary",
    });

    // tab to secondary button and open the submenu, should not focus primary dropdown items as they are not open
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(secondaryButton).toHaveFocus();
    await user.keyboard("{Enter}");

    const dropdownItem1 = screen.getByText("Key stage 3").closest("button");

    expect(dropdownItem1).toBeInTheDocument();

    await user.tab();
    expect(dropdownItem1).toHaveFocus();
  });
  it("Tabs through subject buttons when open and returns to keystage buttons and nav buttons", async () => {
    const user = userEvent.setup();
    render(<TopNav {...mockProps} />);

    const secondaryButton = await screen.findByRole("button", {
      name: "Secondary",
    });
    const curriculumButton = await screen.findByRole("button", {
      name: "Curriculum",
    });

    // tab to secondary button and open the submenu, should not focus primary dropdown items as they are not open
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(secondaryButton).toHaveFocus();
    await user.keyboard("{Enter}");

    const dropdownItem2 = screen.getByText("Key stage 4").closest("button");
    const allSubjectsLink = screen.getByText(/All KS3 subjects/).closest("a");

    const subjectButton1 = screen.getByText("History").closest("a");

    expect(subjectButton1).toBeInTheDocument();
    expect(allSubjectsLink).toBeInTheDocument();

    // in the test environment the default event handler for tab does not tab to this point so we have to manually call the focus manager handler to move focus to the next item
    allSubjectsLink?.focus();
    // return to the second dropdown item when tabbing from the last subject button
    await user.tab();
    expect(dropdownItem2).toHaveFocus();

    // return to the next nav item after tabbing from the last dropdown item
    await user.tab();
    expect(curriculumButton).toHaveFocus();
  });

  // it("Tabs to the next focusable item when tabbing from the last item in the dropdown", async () => {
  //   const user = userEvent.setup();
  //   render(<TopNav {...mockProps} />);
  //   const aboutUsButton = await screen.findByRole("button", {
  //     name: "About us",
  //   });
  //   const searchBar = screen.getByPlaceholderText(/Search/);

  //   aboutUsButton.focus();
  //   expect(aboutUsButton).toHaveFocus();
  //   await user.keyboard("{Enter}");

  //   const dropdownItem2 = screen.getByText("Board").closest("a");

  //   expect(dropdownItem2).toBeInTheDocument();
  //   dropdownItem2?.focus();

  //   await user.tab();
  //   expect(searchBar).toHaveFocus();
  // });
  it("ArrowRight and ArrowLeft navigate Teachers subnav buttons", async () => {
    const user = userEvent.setup();
    render(<TopNav {...mockProps} />);

    const buttons = subnavLabels.map((label) =>
      screen.getByRole("button", { name: label }),
    );
    const [
      primaryButton,
      secondaryButton,
      curriculumButton,
      guidanceButton,
      aboutUsButton,
    ] = buttons;

    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(primaryButton).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(secondaryButton).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(curriculumButton).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(guidanceButton).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(aboutUsButton).toHaveFocus();
    // should wrap around to the first button
    await user.keyboard("{ArrowRight}");
    expect(primaryButton).toHaveFocus();
    //   left arrow should also wrap
    await user.keyboard("{ArrowLeft}");
    expect(aboutUsButton).toHaveFocus();
  });
  it("ArrowDown and ArrowUp navigate keystage buttons in dropdown", async () => {
    const user = userEvent.setup();
    render(<TopNav {...mockProps} />);

    const secondaryButton = await screen.findByRole("button", {
      name: "Secondary",
    });
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    await user.tab();
    expect(secondaryButton).toHaveFocus();
    await user.keyboard("{Enter}");
    const dropdownItem1 = screen.getByText("Key stage 3").closest("button");
    const dropdownItem2 = screen.getByText("Key stage 4").closest("button");

    expect(dropdownItem1).toBeInTheDocument();
    expect(dropdownItem2).toBeInTheDocument();

    await user.tab();
    expect(dropdownItem1).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(dropdownItem2).toHaveFocus();
    // should wrap around to the first item
    await user.keyboard("{ArrowDown}");
    expect(dropdownItem1).toHaveFocus();
    // should wrap around to the last item
    await user.keyboard("{ArrowUp}");
    expect(dropdownItem2).toHaveFocus();
  });

  it("Focus returns to navbar after closing dropdown with Escape", async () => {
    const user = userEvent.setup();
    render(<TopNav {...mockProps} />);

    const secondaryButton = await screen.findByRole("button", {
      name: "Secondary",
    });

    // tab to secondary button and open the submenu, should not focus primary dropdown items as they are not open
    secondaryButton.focus();
    expect(secondaryButton).toHaveFocus();
    await user.keyboard("{Enter}");

    const dropdownItem1 = screen.getByText("Key stage 3").closest("button");
    const subjectButton1 = screen.getByText("History").closest("a");

    expect(dropdownItem1).toBeInTheDocument();
    expect(subjectButton1).toBeInTheDocument();

    await user.tab();
    expect(dropdownItem1).toHaveFocus();

    await user.tab();
    expect(subjectButton1).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(secondaryButton).toHaveFocus();
  });
});
