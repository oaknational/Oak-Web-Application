import React from "react";

import { GoogleClassroomOptionsAnalytics } from "./GoogleClassroomOptionsAnalytics";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const optionsViewMock = jest.fn();
const trackBrowseRefined = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: unknown[]) => trackBrowseRefined(...args),
    },
  }),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  OptionsView: (props: never) => {
    optionsViewMock(props);
    return <div />;
  },
}));

const defaultProps = {
  programmes: [],
  baseSlug: "maths-h",
  programmeUrlTemplate: "/classroom/browse/programmes/:programmeSlug/units",
  backUrlTemplate: "/classroom/browse",
  getAvailableProgrammeFactorAction: jest.fn(),
};

describe("GoogleClassroomOptionsAnalytics", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls track.browseRefined with tier filter args when a tier option is selected", () => {
    renderWithTheme(<GoogleClassroomOptionsAnalytics {...defaultProps} />);

    const { onOptionSelected } = optionsViewMock.mock.calls[0][0];
    onOptionSelected("tier", { factorSlug: "higher" });

    expect(trackBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "google-classroom",
        componentType: "learning_tier_button",
        filterType: "Tier filter",
        filterValue: "higher",
        activeFilters: {
          tier: "higher",
          examboard: undefined,
          pathway: undefined,
        },
      }),
    );
  });

  it("calls track.browseRefined with examboard filter args when an examboard option is selected", () => {
    renderWithTheme(<GoogleClassroomOptionsAnalytics {...defaultProps} />);

    const { onOptionSelected } = optionsViewMock.mock.calls[0][0];
    onOptionSelected("examboard", { factorSlug: "aqa" });

    expect(trackBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "programme_card",
        filterType: "Exam board filter",
        filterValue: "aqa",
        activeFilters: {
          tier: undefined,
          examboard: "aqa",
          pathway: undefined,
        },
      }),
    );
  });

  it("calls track.browseRefined with pathway filter args when a pathway option is selected", () => {
    renderWithTheme(<GoogleClassroomOptionsAnalytics {...defaultProps} />);

    const { onOptionSelected } = optionsViewMock.mock.calls[0][0];
    onOptionSelected("pathway", { factorSlug: "combined-higher" });

    expect(trackBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        componentType: "programme_card",
        filterType: "Pathway filter",
        filterValue: "combined-higher",
        activeFilters: {
          tier: undefined,
          examboard: undefined,
          pathway: "combined-higher",
        },
      }),
    );
  });
});
