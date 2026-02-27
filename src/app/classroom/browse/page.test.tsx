import React from "react";
import { screen } from "@testing-library/react";

import Page from "./page";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const browseViewMock = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: jest.fn(),
    },
  }),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  GoogleClassroomBrowseView: (props: never) => {
    browseViewMock(props);
    return <div data-testid="browse-view">Browse</div>;
  },
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
});
