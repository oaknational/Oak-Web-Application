import { useState, useEffect } from "react";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  TeacherNote,
  TeacherNoteCamelCase,
} from "@oaknational/oak-pupil-client";

import { useShareExperiment } from "@/pages-helpers/teacher/share-experiments/useShareExperiment";
import { useTeacherNotes } from "@/pages-helpers/teacher/share-experiments/useTeacherNotes";
import { TeacherShareNotesButton } from "@/components/TeacherComponents/TeacherShareNotesButton/TeacherShareNotesButton";
import { CurriculumTrackingProps } from "@/pages-helpers/teacher/share-experiments/shareExperimentTypes";

export type UseLessonProps = {
  lessonSlug: string;
  unitSlug?: string;
  programmeSlug?: string;
  source: "lesson-browse" | "lesson-canonical";
  curriculumTrackingProps: CurriculumTrackingProps;
};

type UseLessonReturn = {
  teacherNotesButton: JSX.Element;
  teacherNoteHtml: string | undefined;
  teacherNotesOpen: boolean;
  setTeacherNotesOpen: (open: boolean) => void;
  teacherNote: TeacherNoteCamelCase | null;
  isEditable: boolean;
  saveTeacherNote: (
    note: Partial<TeacherNoteCamelCase>,
  ) => Promise<TeacherNote>;
  error: string | null;
  browserUrl: string | null;
  shareUrl: string | null;
};

export const useLesson = ({
  programmeSlug,
  source,
  curriculumTrackingProps,
}: UseLessonProps): UseLessonReturn => {
  const [teacherNotesOpen, setTeacherNotesOpen] = useState(false);
  const [lessonPath, setLessonPath] = useState<string | null>(null);
  const teacherNotesEnabled = useFeatureFlagEnabled("teacher-notes");

  const overrideExistingShareId =
    teacherNotesEnabled === undefined ? null : !teacherNotesEnabled;

  const { shareUrl, browserUrl, shareActivated, shareIdRef, shareIdKeyRef } =
    useShareExperiment({
      programmeSlug,
      source,
      curriculumTrackingProps,
      overrideExistingShareId:
        overrideExistingShareId ??
        (teacherNotesEnabled === undefined ? null : !teacherNotesEnabled),
    });

  const { teacherNote, isEditable, saveTeacherNote, noteSaved, error } =
    useTeacherNotes({
      lessonPath,
      shareId: shareIdRef.current,
      sidKey: shareIdKeyRef.current,
      enabled: Boolean(teacherNotesEnabled),
      curriculumTrackingProps,
    });

  useEffect(() => {
    if (teacherNotesEnabled) {
      setLessonPath(window.location.href.split("?")[0] || null);
    }

    if (window.location.href !== browserUrl) {
      window.history.replaceState({}, "", browserUrl);
    }
  }, [browserUrl, teacherNotesEnabled]);

  const teacherNotesButton = (
    <TeacherShareNotesButton
      teacherNotesEnabled={teacherNotesEnabled ?? false}
      isEditable={isEditable}
      noteSaved={noteSaved}
      setTeacherNotesOpen={setTeacherNotesOpen}
      shareUrl={shareUrl}
      shareActivated={shareActivated}
    />
  );

  const teacherNoteHtml =
    teacherNotesEnabled && !isEditable ? teacherNote?.noteHtml : undefined;

  return {
    teacherNotesButton,
    teacherNoteHtml,
    teacherNotesOpen,
    setTeacherNotesOpen,
    teacherNote,
    isEditable,
    saveTeacherNote,
    error,
    browserUrl,
    shareUrl,
  };
};
