import {
  phaseDescriptions,
  phaseSlugs,
  subjects,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";
import z from "zod";
import { createStore } from "zustand";

export type ProgrammeState = {
  subject: {
    slug: z.infer<typeof subjectSlugs>;
    title: z.infer<typeof subjects>;
  };
  phase: {
    slug: z.infer<typeof phaseSlugs>;
    title: z.infer<typeof phaseDescriptions>;
  };
  year: {
    id: string;
    slug: string;
    title: string;
  } | null; /// TODO: use proper types
};

export type TeacherBrowseStore = {
  programmeState: ProgrammeState;
  actions: {
    setYear: (
      year: {
        id: string;
        slug: string;
        title: string;
      } | null,
    ) => void;
  };
};

export const createTeacherBrowseStore = (initialState: TeacherBrowseStore) => {
  return createStore<TeacherBrowseStore>()((set) => ({
    ...initialState,
    actions: {
      setYear: (
        yearState: {
          id: string;
          slug: string;
          title: string;
        } | null,
      ) => {
        set((state) => ({
          programmeState: { ...state.programmeState, year: yearState },
        }));

        // TODO: add tracking

        const searchParams = new URLSearchParams(
          globalThis.location.search.slice(1),
        );
        if (yearState) {
          searchParams.set("years", yearState.id);
        } else {
          searchParams.delete("years");
        }
        globalThis.history.replaceState(
          null,
          "",
          `?${searchParams.toString()}`,
        );
      },
    },
  }));
};
