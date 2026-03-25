import React from "react";

import { GoogleClassroomSubjects } from "./GoogleClassroomSubjects";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const subjectsPageViewMock = jest.fn();
const trackSubjectSelected = jest.fn();

const googleClassroomAnalyticsMock = {
  trackSubjectSelected,
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
  SubjectsPageView: (props: never) => {
    subjectsPageViewMock(props);
    return <div />;
  },
  useGoogleClassroomAddonStore: jest.fn().mockReturnValue(null),
}));

describe("GoogleClassroomSubjects", () => {
  beforeEach(() => jest.clearAllMocks());

  it("dispatches trackSubjectSelected when a subject is selected", () => {
    renderWithTheme(
      <GoogleClassroomSubjects
        subjects={[]}
        unitsUrlTemplate="/classroom/browse/programmes/:programmeSlug/units"
        optionsUrlTemplate="/classroom/browse/programmes/:programmeSlug/options"
      />,
    );

    const { onSubjectSelected } = subjectsPageViewMock.mock.calls[0][0];
    onSubjectSelected({ programmeFields: { subjectSlug: "maths" } });

    expect(trackSubjectSelected).toHaveBeenCalledWith({
      programmeFields: { subjectSlug: "maths" },
    });
  });

  it("passes through the base subject object when subjectSlug is null", () => {
    renderWithTheme(
      <GoogleClassroomSubjects
        subjects={[]}
        unitsUrlTemplate="/classroom/browse/programmes/:programmeSlug/units"
        optionsUrlTemplate="/classroom/browse/programmes/:programmeSlug/options"
      />,
    );

    const { onSubjectSelected } = subjectsPageViewMock.mock.calls[0][0];
    onSubjectSelected({ programmeFields: { subjectSlug: null } });

    expect(trackSubjectSelected).toHaveBeenCalledWith({
      programmeFields: { subjectSlug: null },
    });
  });
});
