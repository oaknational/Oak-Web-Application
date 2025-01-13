import {
  TeacherNoteCamelCase,
  TeacherNote,
  useOakPupil,
} from "@oaknational/oak-pupil-client";
import { set } from "lodash";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect, useState } from "react";

export type UseTeacherNotesProps = {
  lessonUrl?: string | null;
  shareId: string | null;
};

export const useTeacherNotes = ({
  lessonUrl,
  shareId,
}: UseTeacherNotesProps) => {
  const teacherNotesEnabled = useFeatureFlagEnabled("teacher-notes");
  const { getTeacherNote, addTeacherNote } = useOakPupil();
  const [teacherNote, setTeacherNote] = useState<TeacherNoteCamelCase | null>(
    null,
  );

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchTeacherNote = async () => {
      if (!lessonUrl) {
        return;
      }

      try {
        // retrieve any existing teacher note from the url only
        const { isEditable, teacherNote } = await getTeacherNote({
          lessonUrl,
        });
        setIsEditable(isEditable);
        setTeacherNote(teacherNote);
      } catch (e) {
        // there is no teacher note lets make a new one against the shareId
        if (shareId) {
          const t: TeacherNoteCamelCase = {
            lessonUrl,
            noteId: shareId,
            noteText: "",
            noteHtml: "",
          };

          setTeacherNote(t);
        }

        return;
      }
    };

    if (teacherNotesEnabled) {
      fetchTeacherNote();
    }
  }, [teacherNotesEnabled, getTeacherNote, lessonUrl, shareId]);

  const saveTeacherNote = (
    updatedTeacherNote: Partial<TeacherNoteCamelCase>,
  ): Promise<TeacherNote> => {
    const t = { ...teacherNote, ...updatedTeacherNote } as TeacherNoteCamelCase;
    const res = addTeacherNote({ teacherNote: t });
    setTeacherNote(t);
    return res.promise;
  };

  return { teacherNote, isEditable, saveTeacherNote, teacherNotesEnabled };
};
