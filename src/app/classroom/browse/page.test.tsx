import React from "react";
import { screen } from "@testing-library/react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const browseViewMock = jest.fn();
const trackYearSelectedMock = jest.fn();

const googleClassroomAnalyticsMock = {
  trackYearSelected: trackYearSelectedMock,
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
  GoogleClassroomBrowseView: (props: never) => {
    browseViewMock(props);
    return <div data-testid="browse-view">Browse</div>;
  },
  useGoogleClassroomAddonStore: jest.fn().mockReturnValue(null),
}));

describe("src/app/classroom/browse/page", () => {
  beforeEach(() => jest.clearAllMocks());

  it("provides the expected years and template", () => {
    renderWithTheme(<Page />);

    expect(browseViewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subjectsUrlTemplate: "/classroom/browse/years/:yearSlug/subjects",
      }),
    );

    const { years } = browseViewMock.mock.calls[0][0];
    expect(years).toHaveLength(11);
    expect(years[0]).toEqual({
      yearSlug: "year-1",
      yearDescription: "Year 1",
      phase: "primary",
    });
    expect(years.at(-1)).toEqual({
      yearSlug: "year-11",
      yearDescription: "Year 11",
      phase: "secondary",
    });
    expect(screen.getByTestId("browse-view")).toBeInTheDocument();
  });

  it("dispatches year selection through the Google Classroom analytics hook", () => {
    renderWithTheme(<Page />);

    const { onYearSelected } = browseViewMock.mock.calls[0][0];
    onYearSelected({
      yearSlug: "year-7",
      yearDescription: "Year 7",
      phase: "secondary",
    });

    expect(trackYearSelectedMock).toHaveBeenCalledWith({
      yearSlug: "year-7",
      yearDescription: "Year 7",
      phase: "secondary",
    });
  });
});
