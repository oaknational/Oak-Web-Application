import {
  TeacherNoteCamelCase,
  useOakPupil,
} from "@oaknational/oak-pupil-client";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect, useState } from "react";

export type UseTeacherNotesProps = {
  lessonUrl?: string;
  shareId: string | null;
};

export const useTeacherNotes = ({ lessonUrl }: UseTeacherNotesProps) => {
  const teacherNotesEnabled = useFeatureFlagEnabled("teacher-notes");
  const { getTeacherNote } = useOakPupil();
  const [teacherNote, setTeacherNote] = useState<TeacherNoteCamelCase | null>(
    null,
  );

  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchTeacherNote = async () => {
      try {
        // retrieve any existing teacher note from the url
        const { isEditable, teacherNote } = await getTeacherNote({
          lessonUrl,
        });
        setIsEditable(isEditable);
        setTeacherNote(teacherNote);
      } catch (e) {
        console.error(e);
        return;
      }
    };

    if (teacherNotesEnabled && lessonUrl) {
      fetchTeacherNote();
    }
  }, [teacherNotesEnabled, getTeacherNote, lessonUrl]);

  //   const saveTeacherNote = async (teacherNote: TeacherNoteCamelCase) => {};

  return { teacherNote, isEditable };
};
