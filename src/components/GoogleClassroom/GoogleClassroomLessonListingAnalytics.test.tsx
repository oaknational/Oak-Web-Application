import React from "react";

import { GoogleClassroomLessonListingAnalytics } from "./GoogleClassroomLessonListingAnalytics";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const lessonListingViewMock = jest.fn();
const trackClassroomLessonSelected = jest.fn();
const trackClassroomLessonPreviewed = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      classroomLessonSelected: (...args: unknown[]) =>
        trackClassroomLessonSelected(...args),
      classroomLessonPreviewed: (...args: unknown[]) =>
        trackClassroomLessonPreviewed(...args),
    },
  }),
}));

jest.mock("@oaknational/google-classroom-addon/ui", () => ({
  LessonListingView: (props: never) => {
    lessonListingViewMock(props);
    return <div />;
  },
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

describe("GoogleClassroomLessonListingAnalytics", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fires classroomLessonSelected with correct args when a lesson is selected", () => {
    renderWithTheme(
      <GoogleClassroomLessonListingAnalytics {...defaultProps} />,
    );

    const { onLessonSelected } = lessonListingViewMock.mock.calls[0][0];
    onLessonSelected("lesson-a");

    expect(trackClassroomLessonSelected).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonName: "Introduction to Algebra",
        lessonSlug: "lesson-a",
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: "2024-01-01",
        unitName: "Algebra",
        unitSlug: "algebra-1",
      }),
    );
  });

  it("fires classroomLessonPreviewed with correct args when a lesson is previewed", () => {
    renderWithTheme(
      <GoogleClassroomLessonListingAnalytics {...defaultProps} />,
    );

    const { onLessonPreviewed } = lessonListingViewMock.mock.calls[0][0];
    onLessonPreviewed("lesson-a");

    expect(trackClassroomLessonPreviewed).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonName: "Introduction to Algebra",
        lessonSlug: "lesson-a",
        lessonReleaseCohort: "2023-2026",
        lessonReleaseDate: "2024-01-01",
        unitSlug: "algebra-1",
      }),
    );
  });

  it("uses lessonReleaseCohort '2020-2023' for legacy lessons", () => {
    renderWithTheme(
      <GoogleClassroomLessonListingAnalytics {...defaultProps} />,
    );

    const { onLessonSelected } = lessonListingViewMock.mock.calls[0][0];
    onLessonSelected("lesson-b");

    expect(trackClassroomLessonSelected).toHaveBeenCalledWith(
      expect.objectContaining({
        lessonReleaseCohort: "2020-2023",
      }),
    );
  });

  it("falls back to 'unreleased' when lessonReleaseDate is null", () => {
    renderWithTheme(
      <GoogleClassroomLessonListingAnalytics {...defaultProps} />,
    );

    const { onLessonSelected } = lessonListingViewMock.mock.calls[0][0];
    onLessonSelected("lesson-b");

    expect(trackClassroomLessonSelected).toHaveBeenCalledWith(
      expect.objectContaining({ lessonReleaseDate: "unreleased" }),
    );
  });

  it("does not fire classroomLessonSelected when lesson slug is not in browseData", () => {
    renderWithTheme(
      <GoogleClassroomLessonListingAnalytics {...defaultProps} />,
    );

    const { onLessonSelected } = lessonListingViewMock.mock.calls[0][0];
    onLessonSelected("nonexistent-slug");

    expect(trackClassroomLessonSelected).not.toHaveBeenCalled();
  });

  it("does not fire classroomLessonPreviewed when lesson slug is not in browseData", () => {
    renderWithTheme(
      <GoogleClassroomLessonListingAnalytics {...defaultProps} />,
    );

    const { onLessonPreviewed } = lessonListingViewMock.mock.calls[0][0];
    onLessonPreviewed("nonexistent-slug");

    expect(trackClassroomLessonPreviewed).not.toHaveBeenCalled();
  });
});
