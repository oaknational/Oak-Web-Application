import React from "react";

import { GoogleClassroomSubjects } from "./GoogleClassroomSubjects";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const subjectsPageViewMock = jest.fn();
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
  SubjectsPageView: (props: never) => {
    subjectsPageViewMock(props);
    return <div />;
  },
  useGoogleClassroomAddonStore: jest.fn().mockReturnValue(null),
}));

describe("GoogleClassroomSubjects", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls track.browseRefined with correct args when a subject is selected", () => {
    renderWithTheme(
      <GoogleClassroomSubjects
        subjects={[]}
        unitsUrlTemplate="/classroom/browse/programmes/:programmeSlug/units"
        optionsUrlTemplate="/classroom/browse/programmes/:programmeSlug/options"
      />,
    );

    const { onSubjectSelected } = subjectsPageViewMock.mock.calls[0][0];
    onSubjectSelected({ programmeFields: { subjectSlug: "maths" } });

    expect(trackBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({
        platform: "google-classroom",
        componentType: "subject_card",
        filterType: "Subject filter",
        filterValue: "maths",
        engagementIntent: "refine",
      }),
    );
  });

  it("uses empty string for filterValue when subjectSlug is null", () => {
    renderWithTheme(
      <GoogleClassroomSubjects
        subjects={[]}
        unitsUrlTemplate="/classroom/browse/programmes/:programmeSlug/units"
        optionsUrlTemplate="/classroom/browse/programmes/:programmeSlug/options"
      />,
    );

    const { onSubjectSelected } = subjectsPageViewMock.mock.calls[0][0];
    onSubjectSelected({ programmeFields: { subjectSlug: null } });

    expect(trackBrowseRefined).toHaveBeenCalledWith(
      expect.objectContaining({ filterValue: "" }),
    );
  });
});
