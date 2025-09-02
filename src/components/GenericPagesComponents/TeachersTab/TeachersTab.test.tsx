import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TeachersTab from "./TeachersTab";

import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => false,
}));

const browseRefined = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefinedAccessed: (...args: unknown[]) => browseRefined(...args),
    },
  }),
}));

// Mock link button so it doesn't attempt to navigate on click
jest.mock("@oaknational/oak-components", () => ({
  ...jest.requireActual("@oaknational/oak-components"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OakPrimaryInvertedButton: (args: any) => <a {...args} href="" />,
}));

describe("TeachersTab", () => {
  it("renders without crashing", () => {
    renderWithProviders()(<TeachersTab keyStages={keyStageKeypad.keyStages} />);
    const teachersH1 = screen.getByRole("heading", { level: 1 });
    expect(teachersH1).toHaveTextContent("Teachers");
  });
  it("calls tracking on keystage selection", async () => {
    renderWithProviders()(<TeachersTab keyStages={keyStageKeypad.keyStages} />);
    const eyfsLabels = await screen.findAllByText("EYFS");
    const keyStageButton = eyfsLabels[0]?.closest("a");
    if (!keyStageButton) {
      throw new Error("Key stage button not found");
    }
    await userEvent.click(keyStageButton);
    expect(browseRefined).toHaveBeenCalledWith({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "keystage_keypad_button",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterType: "Key stage filter",
      filterValue: "eyfs",
      activeFilters: {},
    });
  });
});
