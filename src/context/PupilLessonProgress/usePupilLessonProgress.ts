import { create, StateCreator } from "zustand";
import { createStore } from "zustand/vanilla";

import { getDefaultLessonProgressState } from "./pupilLessonProgressHelpers";
import {
  completeSectionAction,
  lessonInitialiseAction,
  updateSectionInProgressResultAction,
} from "./pupilLessonProgressStateActions";
import { PupilLessonProgressState } from "./pupilLessonProgressTypes";

export const createPupilLessonProgressState: StateCreator<
  PupilLessonProgressState
> = (set) => ({
  ...getDefaultLessonProgressState(),
  initialiseLessonProgress: ({
    lessonSlug,
    lessonReviewSections,
    initialSectionResults,
    isReadOnly = false,
    isHydratingInitialProgress = false,
  }) =>
    set((state) =>
      lessonInitialiseAction(state, {
        lessonSlug,
        lessonReviewSections,
        initialSectionResults,
        isReadOnly,
        isHydratingInitialProgress,
      }),
    ),
  markLessonStarted: () =>
    set(() => ({
      lessonStarted: true,
    })),
  completeSection: (section) =>
    set((state) => completeSectionAction(state, section)),
  updateSectionInProgressResult: (section, result) =>
    set((state) => updateSectionInProgressResultAction(state, section, result)),
  updateWorksheetDownloaded: (result) =>
    set((state) => updateSectionInProgressResultAction(state, "intro", result)),
  updateAdditionalFilesDownloaded: (result) =>
    set((state) => updateSectionInProgressResultAction(state, "intro", result)),
  dismissContentGuidance: () =>
    set(() => ({
      contentGuidanceDismissed: true,
    })),
  setHydratingInitialProgress: (isHydratingInitialProgress) =>
    set(() => ({
      isHydratingInitialProgress,
    })),
  resetLessonProgress: () => set(() => getDefaultLessonProgressState()),
});

export const usePupilLessonProgress = create<PupilLessonProgressState>()(
  createPupilLessonProgressState,
);

export const createPupilLessonProgressStore = () =>
  createStore<PupilLessonProgressState>()(createPupilLessonProgressState);

export type PupilLessonProgressStateShape = ReturnType<
  typeof usePupilLessonProgress.getState
>;
