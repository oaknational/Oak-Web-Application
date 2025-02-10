import { useState, useEffect } from "react";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  TeacherNote,
  TeacherNoteCamelCase,
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
  shareActivated: (noteLengthChars?: number) => void;
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

  const appendedSource: ShareSource = teacherNotesEnabled
    ? `${source}-w-note`
    : source;

  const { shareUrl, browserUrl, shareActivated, shareIdRef, shareIdKeyRef } =
    useShareExperiment({
      programmeSlug,
      source: appendedSource,
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
    if (teacherNotesEnabled) {
      setLessonPath(window.location.href.split("?")[0] || null);
    }

    if (window.location.href !== browserUrl) {
      window.history.replaceState({}, "", browserUrl);
    }
  }, [browserUrl, teacherNotesEnabled]);

  const handleTeacherNotesOpen = () => {
    setTeacherNotesOpen(true);
    track.teacherNoteDialogueOpened({
      sourcePageSlug: lessonPath,
      ...curriculumTrackingProps,
      ...coreTrackingProps,
      shareId: shareIdRef.current,
      linkUrl: window.location.href,
    });
  };

  const teacherNotesButton = (
    <TeacherShareNotesButton
      teacherNotesEnabled={teacherNotesEnabled ?? false}
      isEditable={isEditable}
      noteSaved={noteSaved}
      onTeacherNotesOpen={handleTeacherNotesOpen}
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
    shareActivated,
    teacherNote,
    isEditable,
    saveTeacherNote,
    error,
    browserUrl,
    shareUrl,
  };
};
