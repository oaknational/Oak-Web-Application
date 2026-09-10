import { create, StateCreator } from "zustand";
import { createStore } from "zustand/vanilla";

import {
  getDefaultPupilLessonQuizState,
  handleNextQuestionAction,
  initialiseQuizAction,
  updateQuestionAtCurrentIndexAction,
} from "./pupilLessonQuizStateActions";
import { PupilLessonQuizState } from "./pupilLessonQuizTypes";

export const createPupilLessonQuizState: StateCreator<PupilLessonQuizState> = (
  set,
) => ({
  ...getDefaultPupilLessonQuizState(),
  initialiseQuiz: (args) => set((state) => initialiseQuizAction(state, args)),
  updateQuestionMode: (mode) =>
    set((state) =>
      updateQuestionAtCurrentIndexAction(state, {
        mode,
      }),
    ),
  updateHintOffered: (offerHint) =>
    set((state) =>
      updateQuestionAtCurrentIndexAction(state, {
        offerHint,
      }),
    ),
  applyCurrentQuestionResult: (result) =>
    set((state) => updateQuestionAtCurrentIndexAction(state, result)),
  handleNextQuestion: () => set((state) => handleNextQuestionAction(state)),
  resetQuiz: () => set(() => getDefaultPupilLessonQuizState()),
});

export const usePupilLessonQuiz = create<PupilLessonQuizState>()(
  createPupilLessonQuizState,
);

export const createPupilLessonQuizStore = () =>
  createStore<PupilLessonQuizState>()(createPupilLessonQuizState);
