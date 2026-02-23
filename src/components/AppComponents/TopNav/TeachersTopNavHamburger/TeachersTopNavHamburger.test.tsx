import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  getEYFSAriaLabel,
  TeachersTopNavHamburger,
} from "./TeachersTopNavHamburger";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { topNavFixture } from "@/node-lib/curriculum-api-2023/fixtures/topNav.fixture";

const mockTopNavProps = topNavFixture.teachers!;

const render = renderWithProviders();

const mockBrowseRefined = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: []) => mockBrowseRefined(...args),
    },
  }),
}));

describe("TeachersTopNavHamburger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component", () => {
    const { getByTestId } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    expect(getByTestId("top-nav-hamburger-button")).toBeInTheDocument();
  });

  it("should display main menu content when no submenu is open", async () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should display submenu content when a submenu is opened", async () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );

    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const keyStageItem = getByText("Key stage 1");
    await user.click(keyStageItem);
    expect(getByText("English")).toBeInTheDocument();
  });

  it("should focus the first list item when submenu is opened", async () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const keyStageItem = getByText("Key stage 1");
    await user.click(keyStageItem);
    const firstListItem = getByText("English");
    expect(document?.activeElement?.textContent).toBe(
      firstListItem.textContent,
    );
  });

  it("should close submenu and return to main menu when back button is triggered", async () => {
    const { getByTestId, getByText, queryByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const keyStageItem = getByText("Key stage 1");
    await user.click(keyStageItem);

    const backButton = getByText("Key stage 1");
    await user.click(backButton);

    expect(queryByText("English")).not.toBeInTheDocument();
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should focus the triggering element when returning to main menu from submenu", async () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();

    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const keyStageItem = getByText("Key stage 3");
    await user.click(keyStageItem);

    const backButton = getByText("Key stage 3");
    await user.click(backButton);

    expect(document?.activeElement?.textContent).toBe(keyStageItem.textContent);
  });

  it("should reset all states when modal closes", async () => {
    const { getByTestId, getByText, queryByText, getByLabelText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const keyStageItem = getByText("Key stage 2");
    await user.click(keyStageItem);

    const closeButton = getByLabelText("Close");
    await user.click(closeButton);

    await waitFor(() => expect(closeButton).not.toBeInTheDocument());

    await user.click(button);

    expect(queryByText("Science")).not.toBeInTheDocument();
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it('should only return "Early years foundation stage" for EYFS title', () => {
    const EYFS = getEYFSAriaLabel("EYFS");
    const Ks1 = getEYFSAriaLabel("KS1");
    expect(EYFS).toBe("Early years foundation stage");
    expect(Ks1).toBeUndefined();
  });

  it("should track browse refined when a keystage is selected", async () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const keyStageItem = getByText("Key stage 1");
    await user.click(keyStageItem);

    expect(mockBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        filterType: "Key stage filter",
        filterValue: "ks1",
      }),
    );
  });
  it("should render an aria label for external links", async () => {
    const { getByTestId, getByRole } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const user = userEvent.setup();
    const button = getByTestId("top-nav-hamburger-button");
    await user.click(button);

    const aiExperimentsLink = getByRole("link", {
      name: "AI Experiments (this will open in a new tab)",
    });
    expect(aiExperimentsLink).toHaveTextContent("AI Experiments");
  });
});
