import { useState, useEffect } from "react";
import {
  TeacherNote,
  TeacherNoteCamelCase,
  TeacherNoteError,
} from "@oaknational/oak-pupil-client";

import { useShareExperiment } from "@/pages-helpers/teacher/share-experiments/useShareExperiment";
import { useTeacherNotes } from "@/pages-helpers/teacher/share-experiments/useTeacherNotes";
import { TeacherShareNotesButton } from "@/components/TeacherComponents/TeacherShareNotesButton/TeacherShareNotesButton";
import {
  CoreProperties,
  CurriculumTrackingProps,
} from "@/pages-helpers/teacher/share-experiments/shareExperimentTypes";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { ShareSource } from "@/pages-helpers/teacher/share-experiments/createShareId";
import { LessonReleaseCohortValueType } from "@/browser-lib/avo/Avo";

export type UseLessonProps = {
  lessonSlug: string;
  unitSlug?: string;
  programmeSlug?: string;
  source: "lesson-browse" | "lesson-canonical";
  curriculumTrackingProps: CurriculumTrackingProps & {
    lessonReleaseDate: string;
    lessonReleaseCohort: LessonReleaseCohortValueType;
  };
};

type UseLessonReturn = {
  teacherNotesButton: JSX.Element;
  teacherNoteHtml: string | undefined;
  teacherNotesOpen: boolean;
  setTeacherNotesOpen: (open: boolean) => void;
  shareActivated: (noteLengthChars?: number) => void;
  teacherNote: TeacherNoteCamelCase | null;
  isEditable: boolean | null;
  saveTeacherNote: (
    note: Partial<TeacherNoteCamelCase>,
  ) => Promise<TeacherNote | TeacherNoteError>;
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

  const appendedSource: ShareSource = `${source}-w-note`;

  const { shareUrl, browserUrl, shareActivated, shareIdRef, shareIdKeyRef } =
    useShareExperiment({
      programmeSlug,
      source: appendedSource,
      curriculumTrackingProps,
      overrideExistingShareId: false,
    });

  const { teacherNote, isEditable, saveTeacherNote, noteSaved, error } =
    useTeacherNotes({
      lessonPath,
      shareId: shareIdRef.current,
      sidKey: shareIdKeyRef.current,
      enabled: true,
      curriculumTrackingProps,
    });

  const { track } = useAnalytics();

  const coreTrackingProps: CoreProperties = {
    platform: "owa",
    product: "teacher lesson resources",
    engagementIntent: "advocate",
    componentType: "page view",
    eventVersion: "2.0.0",
    analyticsUseCase: "Teacher",
  };

  useEffect(() => {
    setLessonPath(window.location.href.split("?")[0] || null);

    if (window.location.href !== browserUrl) {
      window.history.replaceState({}, "", browserUrl);
    }
  }, [browserUrl]);

  const handleTeacherNotesOpen = () => {
    setTeacherNotesOpen(true);
    track.teacherNoteDialogueOpened({
      sourcePageSlug: lessonPath,
      ...curriculumTrackingProps,
      ...coreTrackingProps,
      shareId: shareIdRef.current,
      linkUrl: typeof window !== "undefined" ? window.location.href : "",
    });
  };

  const teacherNotesButton = (
    <TeacherShareNotesButton
      isEditable={isEditable}
      noteSaved={noteSaved}
      onTeacherNotesOpen={handleTeacherNotesOpen}
      shareUrl={shareUrl}
      shareActivated={shareActivated}
    />
  );

  const teacherNoteHtml = !isEditable ? teacherNote?.noteHtml : undefined;

  return {
    teacherNotesButton,
    teacherNoteHtml,
    teacherNotesOpen,
    setTeacherNotesOpen,
    shareActivated,
    teacherNote,
    isEditable,
    saveTeacherNote,
    error,
    browserUrl,
    shareUrl,
  };
};
