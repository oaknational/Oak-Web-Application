import React from "react";

import { GoogleClassroomUnitCards } from "./GoogleClassroomUnitCards";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const unitCardsMock = jest.fn();
const trackUnitSelected = jest.fn();

const googleClassroomAnalyticsMock = {
  trackUnitSelected,
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
  UnitCards: (props: never) => {
    unitCardsMock(props);
    return <div />;
  },
  useGoogleClassroomAddonStore: jest.fn().mockReturnValue(null),
}));

describe("GoogleClassroomUnitCards", () => {
  beforeEach(() => jest.clearAllMocks());

  it("dispatches trackUnitSelected when a unit is selected", () => {
    renderWithTheme(
      <GoogleClassroomUnitCards
        units={[]}
        programmeSlug="maths-h"
        unitsLessonListUrlTemplate="/classroom/browse/programmes/:programmeSlug/units/:unitSlug/lessons"
      />,
    );

    const { onUnitSelected } = unitCardsMock.mock.calls[0][0];
    onUnitSelected({ unitSlug: "algebra-1" });

    expect(trackUnitSelected).toHaveBeenCalledWith({
      unitSlug: "algebra-1",
    });
  });
});
