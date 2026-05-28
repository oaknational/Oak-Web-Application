import { screen } from "@testing-library/react";

import TeachersTab from "./TeachersTab";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumPhaseOptions from "@/browser-lib/fixtures/curriculumPhaseOptions";

const setSearchTerm = jest.fn();
jest.mock("@/context/Search/useSearch", () => () => ({ setSearchTerm }));

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: () => false,
}));

const browseRefined = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefinedAccessed: (...args: unknown[]) => browseRefined(...args),
      searchJourneyInitiated: () => jest.fn(),
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
    renderWithProviders()(
      <TeachersTab curriculumPhaseOptions={curriculumPhaseOptions} />,
    );
    const teachersH1 = screen.getByRole("heading", { level: 1 });
    expect(teachersH1).toHaveTextContent(
      "Helping you deliver a world-class curriculum",
    );
  });

  it("renders the subject phase picker", async () => {
    renderWithProviders()(
      <TeachersTab curriculumPhaseOptions={curriculumPhaseOptions} />,
    );
    const subjectPhasePicker = screen.getByRole("navigation");
    expect(subjectPhasePicker).toBeVisible();
  });
});
