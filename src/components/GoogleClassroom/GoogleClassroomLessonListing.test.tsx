import React from "react";

import { GoogleClassroomLessonListing } from "./GoogleClassroomLessonListing";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const lessonListingViewMock = jest.fn();
const trackLessonSelected = jest.fn();
const trackLessonPreviewed = jest.fn();

const googleClassroomAnalyticsMock = {
  trackLessonSelected,
  trackLessonPreviewed,
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
  LessonListingView: (props: never) => {
    lessonListingViewMock(props);
    return <div />;
  },
  useGoogleClassroomAddonStore: jest.fn().mockReturnValue(null),
}));

const browseData = [
  {
    lessonSlug: "lesson-a",
    unitSlug: "algebra-1",
    isLegacy: false,
    lessonData: {
      title: "Introduction to Algebra",
      lessonReleaseDate: "2024-01-01",
    },
    supplementaryData: { orderInUnit: 1 },
    unitData: { title: "Algebra" },
    programmeFields: { subjectSlug: "maths" },
  },
  {
    lessonSlug: "lesson-b",
    unitSlug: "algebra-1",
    isLegacy: true,
    lessonData: {
      title: "Legacy Lesson",
      lessonReleaseDate: null,
    },
    supplementaryData: { orderInUnit: 2 },
    unitData: { title: "Algebra" },
    programmeFields: { subjectSlug: "maths" },
  },
];

const defaultProps = {
  browseData: browseData as never,
  programmeSlug: "maths-h",
  unitData: { title: "Algebra" } as never,
  programmeFields: {
    tier: null,
    examboard: null,
    optionality: null,
  } as never,
  programmeUrlTemplate: "/classroom/browse/programmes/:programmeSlug/units",
  pupilLessonUrlTemplate:
    "/pupils/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug",
};

describe("GoogleClassroomLessonListing", () => {
  beforeEach(() => jest.clearAllMocks());

  it("dispatches trackLessonSelected with the resolved lesson context", () => {
    renderWithTheme(<GoogleClassroomLessonListing {...defaultProps} />);

    const { onLessonSelected } = lessonListingViewMock.mock.calls[0][0];
    onLessonSelected("lesson-a");

    expect(trackLessonSelected).toHaveBeenCalledWith({
      lesson: browseData[0],
      unitData: defaultProps.unitData,
      programmeFields: defaultProps.programmeFields,
    });
  });

  it("dispatches trackLessonPreviewed with the resolved lesson context", () => {
    renderWithTheme(<GoogleClassroomLessonListing {...defaultProps} />);

    const { onLessonPreviewed } = lessonListingViewMock.mock.calls[0][0];
    onLessonPreviewed("lesson-a");

    expect(trackLessonPreviewed).toHaveBeenCalledWith({
      lesson: browseData[0],
      unitData: defaultProps.unitData,
      programmeFields: defaultProps.programmeFields,
    });
  });

  it("does not dispatch trackLessonSelected when lesson slug is not in browseData", () => {
    renderWithTheme(<GoogleClassroomLessonListing {...defaultProps} />);

    const { onLessonSelected } = lessonListingViewMock.mock.calls[0][0];
    onLessonSelected("nonexistent-slug");

    expect(trackLessonSelected).not.toHaveBeenCalled();
  });

  it("does not dispatch trackLessonPreviewed when lesson slug is not in browseData", () => {
    renderWithTheme(<GoogleClassroomLessonListing {...defaultProps} />);

    const { onLessonPreviewed } = lessonListingViewMock.mock.calls[0][0];
    onLessonPreviewed("nonexistent-slug");

    expect(trackLessonPreviewed).not.toHaveBeenCalled();
  });
});
