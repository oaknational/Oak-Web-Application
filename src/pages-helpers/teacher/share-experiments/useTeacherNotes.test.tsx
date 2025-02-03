import React, { ReactNode } from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  OakPupilClientProvider,
  TeacherNoteCamelCase,
  useOakPupil,
} from "@oaknational/oak-pupil-client";

import { useTeacherNotes } from "./useTeacherNotes";
import { CurriculumTrackingProps } from "./shareExperimentTypes";

// Create a single mock client that will be returned by useOakPupil
const mockClient = {
  getTeacherNote: jest.fn(),
  addTeacherNote: jest.fn(),
  getTeacherNoteIsEditable: jest.fn(),
};

jest.mock("@oaknational/oak-pupil-client", () => ({
  __esModule: true,
  ...jest.requireActual("@oaknational/oak-pupil-client"),
  useOakPupil: jest.fn(() => mockClient),
}));

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    track: { teacherNoteSaved: jest.fn() },
  })),
}));

const mockTeacherNote: TeacherNoteCamelCase = {
  noteId: "hkk2-NIFaM",
  sidKey: "sid-ARHMdf",
  noteText: "Test Note",
  noteHtml: "<p>Test Note</p>",
  lessonPath: "teachers/lessons/transverse-waves",
};

describe("useTeacherNotes", () => {
  const useOakPupilMock = useOakPupil as jest.Mock;

  const curriculumTrackingProps: CurriculumTrackingProps = {
    lessonName: "lessonName",
    lessonSlug: "lesson-slug",
    unitName: "unitName",
    unitSlug: "unit-slug",
    subjectSlug: "subjectSlug",
    subjectTitle: "subjectTitle",
    keyStageSlug: "keyStageSlug",
    keyStageTitle: "Key stage 1",
  };

  const createWrapper = () => {
    const config = {
      logLessonAttemptUrl: "example.com",
      getLessonAttemptUrl: "example.com",
      getTeacherNoteUrl: "example.com",
      addTeacherNoteUrl: "example.com",
    };
    return ({ children }: { children: ReactNode }) => (
      <OakPupilClientProvider config={config}>
        {" "}
        {children}{" "}
      </OakPupilClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not attempt to fetch a teacher note if not enabled", async () => {
    const mockGetTeacherNote = useOakPupilMock().getTeacherNote;

    const wrapper = createWrapper();
    // render hook
    renderHook(
      () =>
        useTeacherNotes({
          sidKey: "sidKey",
          lessonPath: "lessonPath",
          shareId: "shareId",
          enabled: false,
          curriculumTrackingProps,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(mockGetTeacherNote).not.toHaveBeenCalled();
    });
  });

  it("should attempt to fetch a teacher note if enabled", async () => {
    const mockGetTeacherNote = useOakPupilMock().getTeacherNote;

    const wrapper = createWrapper();
    // render hook
    renderHook(
      () =>
        useTeacherNotes({
          sidKey: "sidKey",
          lessonPath: "lessonPath",
          shareId: "shareId",
          enabled: true,
          curriculumTrackingProps,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(mockGetTeacherNote).toHaveBeenCalledWith({
        sidKey: "sidKey",
        noteId: "shareId",
      });
    });
  });

  it("should pass the correct teacher note, isEditable, noteSaved to the state when a note is found", async () => {
    const mockGetTeacherNote = useOakPupilMock().getTeacherNote;
    mockGetTeacherNote.mockResolvedValueOnce({
      teacherNote: mockTeacherNote,
      isEditable: true,
    });

    const wrapper = createWrapper();
    // render hook
    const { result } = renderHook(
      () =>
        useTeacherNotes({
          sidKey: "sidKey",
          lessonPath: "lessonPath",
          shareId: "shareId",
          enabled: true,
          curriculumTrackingProps,
        }),
      { wrapper },
    );

    expect(mockGetTeacherNote).toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current.teacherNote).toEqual(mockTeacherNote);
      expect(result.current.isEditable).toEqual(true);
      expect(result.current.noteSaved).toEqual(true);
    });
  });

  it("should not fetch a teacher note if sidKey or lessonPath is missing", async () => {
    const mockGetTeacherNote = useOakPupilMock().getTeacherNote;

    const wrapper = createWrapper();
    // render hook
    renderHook(
      () =>
        useTeacherNotes({
          sidKey: null,
          lessonPath: null,
          shareId: "shareId",
          enabled: true,
          curriculumTrackingProps,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(mockGetTeacherNote).not.toHaveBeenCalled();
    });
  });

  it("should create new note if none is found", async () => {
    const mockGetTeacherNote = useOakPupilMock().getTeacherNote;
    mockGetTeacherNote.mockRejectedValueOnce("error");

    const mockGetTeacherNoteIsEditable =
      useOakPupilMock().getTeacherNoteIsEditable;
    mockGetTeacherNoteIsEditable.mockReturnValueOnce(null);

    const wrapper = createWrapper();
    // render hook
    const { result } = renderHook(
      () =>
        useTeacherNotes({
          sidKey: "sidKey",
          lessonPath: "lessonPath",
          shareId: "shareId",
          enabled: true,
          curriculumTrackingProps,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(mockGetTeacherNote).toHaveBeenCalled();
      expect(mockGetTeacherNoteIsEditable).toHaveBeenCalled();
      expect(result.current.teacherNote).toEqual({
        lessonPath: "lessonPath",
        noteId: "shareId",
        sidKey: "sidKey",
        noteText: "",
        noteHtml: "",
      });
      expect(result.current.isEditable).toEqual(true);
      expect(result.current.noteSaved).toEqual(false);
    });
  });

  it("should set an error when a note is recorded as editable but not found in the database", async () => {
    const mockGetTeacherNote = useOakPupilMock().getTeacherNote;
    mockGetTeacherNote.mockRejectedValueOnce("error");

    const mockGetTeacherNoteIsEditable =
      useOakPupilMock().getTeacherNoteIsEditable;
    mockGetTeacherNoteIsEditable.mockReturnValueOnce(true);

    const wrapper = createWrapper();
    // render hook
    const { result } = renderHook(
      () =>
        useTeacherNotes({
          sidKey: "sidKey",
          lessonPath: "lessonPath",
          shareId: "shareId",
          enabled: true,
          curriculumTrackingProps,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(mockGetTeacherNote).toHaveBeenCalled();
      expect(mockGetTeacherNoteIsEditable).toHaveBeenCalled();
      expect(result.current.error).toEqual("Failed to retrieve teacher note");
    });
  });

  describe("save teacher note", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should save a teacher note", async () => {
      const mockAddTeacherNote = useOakPupilMock().addTeacherNote;
      mockAddTeacherNote.mockResolvedValueOnce({
        promise: "resolved",
      });

      const wrapper = createWrapper();
      // render hook
      const { result } = renderHook(
        () =>
          useTeacherNotes({
            sidKey: "sidKey",
            lessonPath: "lessonPath",
            shareId: "shareId",
            enabled: false,
            curriculumTrackingProps,
          }),
        { wrapper },
      );

      await act(() => {
        result.current.saveTeacherNote(mockTeacherNote);
      });

      expect(mockAddTeacherNote).toHaveBeenCalledWith({
        teacherNote: mockTeacherNote,
      });
    });
  });
});
