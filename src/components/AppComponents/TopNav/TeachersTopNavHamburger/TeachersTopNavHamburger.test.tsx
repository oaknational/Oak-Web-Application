import { act } from "@testing-library/react";

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

  it("should display main menu content when no submenu is open", () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should display submenu content when a submenu is opened", () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key stage 1");
    act(() => {
      keyStageItem.click();
    });
    expect(getByText("English")).toBeInTheDocument();
  });

  it("should focus the first list item when submenu is opened", () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key stage 1");
    act(() => {
      keyStageItem.click();
    });
    const firstListItem = getByText("English");
    expect(document?.activeElement?.textContent).toBe(
      firstListItem.textContent,
    );
  });

  it("should close submenu and return to main menu when back button is triggered", () => {
    const { getByTestId, getByText, queryByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key stage 1");
    act(() => {
      keyStageItem.click();
    });
    const backButton = getByText("Key stage 1");
    act(() => {
      backButton.click();
    });
    expect(queryByText("English")).not.toBeInTheDocument();
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it("should focus the triggering element when returning to main menu from submenu", () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key stage 3");
    act(() => {
      keyStageItem.click();
    });
    const backButton = getByText("Key stage 3");
    act(() => {
      backButton.click();
    });
    expect(document?.activeElement?.textContent).toBe(keyStageItem.textContent);
  });

  it("should reset all states when modal closes", () => {
    const { getByTestId, getByText, queryByText, getByLabelText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key stage 2");
    act(() => {
      keyStageItem.click();
    });
    const closeButton = getByLabelText("Close");
    act(() => {
      closeButton.click();
    });
    act(() => {
      button.click();
    });
    expect(queryByText("Science")).not.toBeInTheDocument();
    expect(getByText("Primary")).toBeInTheDocument();
  });

  it('should only return "Early years foundation stage" for EYFS title', () => {
    const EYFS = getEYFSAriaLabel("EYFS");
    const Ks1 = getEYFSAriaLabel("KS1");
    expect(EYFS).toBe("Early years foundation stage");
    expect(Ks1).toBeUndefined();
  });

  it("should track browse refined when a keystage is selected", () => {
    const { getByTestId, getByText } = render(
      <TeachersTopNavHamburger {...mockTopNavProps} />,
    );
    const button = getByTestId("top-nav-hamburger-button");
    act(() => {
      button.click();
    });
    const keyStageItem = getByText("Key stage 1");
    act(() => {
      keyStageItem.click();
    });
    expect(mockBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        filterType: "Key stage filter",
        filterValue: "ks1",
      }),
    );
  });
});
