import {
  examboards,
  examboardSlugs,
  phaseDescriptions,
  phaseSlugs,
  subjects,
  subjectSlugs,
  yearDescriptions,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";
import z from "zod";
import { createStore } from "zustand";

export type SubjectPhaseState = {
  subject: {
    slug: z.infer<typeof subjectSlugs>;
    title: z.infer<typeof subjects>;
  };
  phase: {
    slug: z.infer<typeof phaseSlugs>;
    title: z.infer<typeof phaseDescriptions>;
  };
  year: {
    slug: z.infer<typeof yearSlugs>;
    title: z.infer<typeof yearDescriptions>;
  } | null;
  // examboard: {
  //   slug: z.infer<typeof examboardSlugs>;
  //   title: z.infer<typeof examboards>;
  // } | null;
  // tiers: { slug; title }[];
  // pathways: { slug; title }[];
};

export type TeacherBrowseStore = {
  subjectPhaseState: SubjectPhaseState;
};

export const createTeacherBrowseStore = (initialState: TeacherBrowseStore) => {
  return createStore<TeacherBrowseStore>()((set) => ({
    ...initialState,
    actions: {
      setSubjectPhaseState: (subjectPhaseState: SubjectPhaseState) =>
        set(() => ({ subjectPhaseState })),
    },
  }));
};
