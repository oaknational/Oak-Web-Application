import React from "react";

import { GoogleClassroomUnitCardsAnalytics } from "./GoogleClassroomUnitCardsAnalytics";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const unitCardsMock = jest.fn();
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
  UnitCards: (props: never) => {
    unitCardsMock(props);
    return <div />;
  },
}));

describe("GoogleClassroomUnitCardsAnalytics", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls track.browseRefined with correct args when a unit is selected", () => {
    renderWithTheme(
      <GoogleClassroomUnitCardsAnalytics
        units={[]}
        programmeSlug="maths-h"
        unitsLessonListUrlTemplate="/classroom/browse/programmes/:programmeSlug/units/:unitSlug/lessons"
      />,
    );

    const { onUnitSelected } = unitCardsMock.mock.calls[0][0];
    onUnitSelected({ unitSlug: "algebra-1" });

    expect(trackBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "google-classroom",
        componentType: "unit_card",
        filterType: "Unit filter",
        filterValue: "algebra-1",
        engagementIntent: "refine",
      }),
    );
  });
});
