import React from "react";

import { GoogleClassroomOptions } from "./GoogleClassroomOptions";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const optionsViewMock = jest.fn();
const trackOptionSelected = jest.fn();

const googleClassroomAnalyticsMock = {
  trackOptionSelected,
};

jest.mock("@/components/GoogleClassroom/useGoogleClassroomAnalytics", () => ({
  __esModule: true,
  useGoogleClassroomAnalytics: (
    selector?: (state: typeof googleClassroomAnalyticsMock) => unknown,
  ) =>
    selector
      ? selector(googleClassroomAnalyticsMock)
      : googleClassroomAnalyticsMock,
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  OptionsView: (props: never) => {
    optionsViewMock(props);
    return <div />;
  },
  useGoogleClassroomAddonStore: jest.fn().mockReturnValue(null),
}));

const defaultProps = {
  programmes: [],
  baseSlug: "maths-h",
  programmeUrlTemplate: "/classroom/browse/programmes/:programmeSlug/units",
  backUrlTemplate: "/classroom/browse",
  getAvailableProgrammeFactorAction: jest.fn(),
};

describe("GoogleClassroomOptions", () => {
  beforeEach(() => jest.clearAllMocks());

  it("dispatches trackOptionSelected when a tier option is selected", () => {
    renderWithTheme(<GoogleClassroomOptions {...defaultProps} />);

    const { onOptionSelected } = optionsViewMock.mock.calls[0][0];
    onOptionSelected("tier", { factorSlug: "higher" });

    expect(trackOptionSelected).toHaveBeenCalledWith("tier", {
      factorSlug: "higher",
    });
  });

  it("dispatches trackOptionSelected when an examboard option is selected", () => {
    renderWithTheme(<GoogleClassroomOptions {...defaultProps} />);

    const { onOptionSelected } = optionsViewMock.mock.calls[0][0];
    onOptionSelected("examboard", { factorSlug: "aqa" });

    expect(trackOptionSelected).toHaveBeenCalledWith("examboard", {
      factorSlug: "aqa",
    });
  });

  it("dispatches trackOptionSelected when a pathway option is selected", () => {
    renderWithTheme(<GoogleClassroomOptions {...defaultProps} />);

    const { onOptionSelected } = optionsViewMock.mock.calls[0][0];
    onOptionSelected("pathway", { factorSlug: "combined-higher" });

    expect(trackOptionSelected).toHaveBeenCalledWith("pathway", {
      factorSlug: "combined-higher",
    });
  });
});
