import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TeachersTab from "./TeachersTab";

import keyStageKeypad from "@/browser-lib/fixtures/keyStageKeypad";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
vi.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => false,
}));

const browseRefined = vi.fn();
vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefinedAccessed: (...args: unknown[]) => browseRefined(...args),
    },
  }),
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
