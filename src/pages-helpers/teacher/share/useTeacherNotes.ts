import { useEffect, useState } from "react";
import {
  TeacherNoteCamelCase,
  TeacherNote,
  TeacherNoteError,
  useOakPupil,
} from "@oaknational/oak-pupil-client";

import { CoreProperties, CurriculumTrackingProps } from "./shareTypes";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { LessonReleaseCohortValueType } from "@/browser-lib/avo/Avo";

export type UseTeacherNotesProps = {
  lessonPath?: string | null;
  sidKey: string | null;
  shareId: string | null;
  enabled: boolean;
  curriculumTrackingProps: CurriculumTrackingProps & {
    lessonReleaseDate: string;
    lessonReleaseCohort: LessonReleaseCohortValueType;
  };
};

export const useTeacherNotes = ({
  sidKey,
  lessonPath,
  shareId,
  enabled,
  curriculumTrackingProps,
}: UseTeacherNotesProps) => {
  const { getTeacherNote, addTeacherNote, getTeacherNoteIsEditable } =
    useOakPupil();

  const { track } = useAnalytics();
  const [teacherNote, setTeacherNote] = useState<TeacherNoteCamelCase | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const [isEditable, setIsEditable] = useState<boolean | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);

  const coreTrackingProps: CoreProperties = {
    platform: "owa",
    product: "teacher lesson resources",
    engagementIntent: "advocate",
    componentType: "page view",
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
  };

  useEffect(() => {
    const fetchTeacherNote = async () => {
      if (!sidKey || !lessonPath) {
        console.error("sidKey or lessonPath is missing");
        return;
      }

      try {
        // retrieve any existing teacher note using whatever is in local storage
        const { isEditable, teacherNote } = await getTeacherNote({
          sidKey,
          noteId: shareId || undefined,
        });

        setIsEditable(isEditable);
        setNoteSaved(isEditable);
        setTeacherNote(teacherNote);
      } catch (e) {
        // there is no teacher note lets make a new one against the shareId
        if (shareId) {
          const _isEditable = getTeacherNoteIsEditable({
            sidKey,
            noteId: shareId,
          });

          const t: TeacherNoteCamelCase = {
            lessonPath,
            noteId: shareId,
            sidKey: sidKey,
            noteText: "",
            noteHtml: "",
          };

          setTeacherNote(t);

          const _noteSaved = _isEditable !== null;

          setNoteSaved(_noteSaved);
          setIsEditable(!_noteSaved || _isEditable);

          if (_noteSaved) {
            setError("Failed to retrieve teacher note");
            // TODO: log error
          }
        }

        return;
      }
    };

    if (enabled) {
      fetchTeacherNote();
    }
  }, [
    enabled,
    getTeacherNote,
    getTeacherNoteIsEditable,
    lessonPath,
    sidKey,
    shareId,
  ]);

  type OakPupilClientTeacherNoteError = {
    additionalInfo?: {
      body?: TeacherNoteError & {
        type: string;
      };
    };
  };
  function isTeacherNoteError(
    error: unknown,
  ): error is OakPupilClientTeacherNoteError {
    if (!(error && typeof error === "object")) return false;
    const errorObj = error as OakPupilClientTeacherNoteError;
    return typeof errorObj.additionalInfo?.body?.type === "string";
  }

  const saveTeacherNote = async (
    updatedTeacherNote: Partial<TeacherNoteCamelCase>,
  ): Promise<TeacherNote | TeacherNoteError> => {
    try {
      const t = {
        ...teacherNote,
        ...updatedTeacherNote,
      } as TeacherNoteCamelCase;
      const res = addTeacherNote({ teacherNote: t });
      setTeacherNote(t);
      setNoteSaved(true);
      // No need to dedupe this event
      track.teacherNoteSaved({
        shareId: t.noteId,
        linkUrl: window.location.href,
        sourcePageSlug: lessonPath,
        ...coreTrackingProps,
        ...curriculumTrackingProps,
        noteLengthChars: t.noteText.length,
      });
      return await res.promise;
    } catch (err: unknown) {
      if (isTeacherNoteError(err)) {
        setNoteSaved(false);
        return Promise.resolve(err?.additionalInfo?.body as TeacherNoteError);
      }
      throw err;
    }
  };

  return { teacherNote, isEditable, error, noteSaved, saveTeacherNote };
};
