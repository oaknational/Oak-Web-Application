import { CurriculumUnitsTrackingData } from "@/pages-helpers/curriculum/docx/tab-helpers";
import {
  phaseDescriptions,
  phaseSlugs,
  subjects,
  subjectSlugs,
} from "@oaknational/oak-curriculum-schema";
import z from "zod";
import { createStore } from "zustand";
import { TrackFns } from "../Analytics/AnalyticsProvider";
import {
  AnalyticsUseCase,
  ComponentType,
  EngagementIntent,
  EventVersion,
  LearningTier,
  Phase,
  Platform,
  Product,
  UnitSequenceRefinedProperties,
} from "@/browser-lib/avo/Avo";

type ItemState = {
  id: string;
  slug: string;
  title: string;
} | null;

export type ProgrammeState = {
  subject: {
    slug: z.infer<typeof subjectSlugs>;
    title: z.infer<typeof subjects>;
  };
  phase: {
    slug: z.infer<typeof phaseSlugs>;
    title: z.infer<typeof phaseDescriptions>;
  };
  year: ItemState; // TODO: use proper types
  tier: ItemState; // TODO: use proper types
};

export type TeacherBrowseStore = {
  programmeState: ProgrammeState;
  track: TrackFns;
  actions: {
    updateYear: (year: ItemState) => void;
    updateTier: (tier: ItemState) => void;
  };
};

const getParams = () =>
  new URLSearchParams(globalThis.location.search.slice(1));
const updateParams = (searchParams: URLSearchParams) => {
  globalThis.history.replaceState(null, "", `?${searchParams.toString()}`);
};

export const createTeacherBrowseStore = (initialState: TeacherBrowseStore) => {
  return createStore<TeacherBrowseStore>()((_, get) => ({
    ...initialState,
    actions: {
      updateYear: (yearState: ItemState) => {
        // can set yearState in store here if needed
        const searchParams = getParams();

        // update search params with new value
        if (yearState) {
          searchParams.set("years", yearState.id);
        } else {
          searchParams.delete("years");
        }

        // Track year filter event
        const { track, programmeState } = get();
        // todo: extract fn to get tracking data
        const analyticsData: UnitSequenceRefinedProperties = {
          yearGroupName: yearState?.title ?? null,
          yearGroupSlug: yearState?.slug ?? null,
          subjectTitle: programmeState.subject.title,
          subjectSlug: programmeState.subject.slug,
          threadTitle: null, // todo
          threadSlug: null, // todo
          platform: Platform.OWA,
          product: Product.CURRICULUM_VISUALISER,
          engagementIntent: EngagementIntent.REFINE,
          componentType: ComponentType.YEAR_GROUP_BUTTON,
          eventVersion: EventVersion["2_0_0"],
          analyticsUseCase: AnalyticsUseCase.TEACHER,
          childSubjectSlug: null, // todo
          childSubjectName: null, // todo
          phase:
            programmeState.phase.slug === "primary"
              ? Phase.PRIMARY
              : Phase.SECONDARY,
          learningTier:
            programmeState.tier?.slug === "foundation"
              ? LearningTier.FOUNDATION
              : programmeState.tier?.slug === "higher"
                ? LearningTier.HIGHER
                : null,
          subjectCategory: null, // todo
          pathway: null, // todo
        };
        track.unitSequenceRefined(analyticsData);

        updateParams(searchParams);
      },
      updateTier: (tierState: ItemState) => {
        const searchParams = getParams();
        if (tierState) {
          searchParams.set("tiers", tierState.id);
        } else {
          searchParams.delete("tiers");
        }

        // TODO: add tracking
        updateParams(searchParams);
      },
    },
  }));
};
