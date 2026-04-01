import type {
  FactorData,
  OnLessonAttachedData,
  ProgrammeFields,
  Subject,
  Unit,
  UnitData,
  Year,
} from "@oaknational/google-classroom-addon/ui";

import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import {
  type AnalyticsUseCaseValueType,
  type ClientEnvironmentValueType,
  ComponentType,
  FilterType,
} from "@/browser-lib/avo/Avo";
import type { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";

export type GoogleClassroomTrackFns = Pick<
  TrackFns,
  | "browseRefined"
  | "classroomLessonSelected"
  | "classroomLessonPreviewed"
  | "classroomAddOnOpened"
  | "classroomSignInStarted"
  | "classroomSignInCompleted"
  | "classroomLessonsAttached"
>;

export type GoogleClassroomFactorType = "tier" | "examboard" | "pathway";

export type GoogleClassroomAnalyticsContextData = {
  track: GoogleClassroomTrackFns;
  clientEnvironment: ClientEnvironmentValueType;
  googleLoginHint: string;
  courseId?: string;
  itemId?: string;
};

export type GoogleClassroomAnalyticsSharedContext = Omit<
  GoogleClassroomAnalyticsContextData,
  "track"
>;

export type GoogleClassroomLessonSelectionArgs = {
  lesson: LessonListingBrowseData[number];
  unitData?: UnitData;
  programmeFields?: ProgrammeFields;
};

export type GoogleClassroomAnalyticsActions = {
  trackYearSelected: (year: Pick<Year, "yearSlug">) => void;
  trackSubjectSelected: (subject: Pick<Subject, "programmeFields">) => void;
  trackOptionSelected: (
    factorType: GoogleClassroomFactorType,
    factor: Pick<FactorData, "factorSlug">,
  ) => void;
  trackUnitSelected: (unit: Pick<Unit, "unitSlug">) => void;
  trackLessonSelected: (args: GoogleClassroomLessonSelectionArgs) => void;
  trackLessonPreviewed: (args: GoogleClassroomLessonSelectionArgs) => void;
  trackAddOnOpened: (args: {
    analyticsUseCase: AnalyticsUseCaseValueType;
  }) => void;
  trackAddOnOpenedOnce: (args: {
    analyticsUseCase: AnalyticsUseCaseValueType;
  }) => boolean;
  trackSignInStarted: (args: {
    analyticsUseCase: AnalyticsUseCaseValueType;
  }) => void;
  trackSignInCompleted: (args: {
    analyticsUseCase: AnalyticsUseCaseValueType;
    subscribeToNewsletter: Parameters<
      GoogleClassroomTrackFns["classroomSignInCompleted"]
    >[0]["subscribeToNewsletter"];
  }) => void;
  trackLessonAttached: (data: OnLessonAttachedData) => void;
  markAddOnNavigation: () => void;
  clearAddOnOpenedFlag: () => void;
};

export type GoogleClassroomAnalyticsStore =
  GoogleClassroomAnalyticsContextData &
    GoogleClassroomAnalyticsActions & {
      actions: GoogleClassroomAnalyticsActions;
      syncContext: (context: GoogleClassroomAnalyticsContextData) => void;
    };

type BrowseRefinedPayload = Parameters<
  GoogleClassroomTrackFns["browseRefined"]
>[0];

export const FACTOR_TO_FILTER: Record<
  GoogleClassroomFactorType,
  BrowseRefinedPayload["filterType"]
> = {
  tier: FilterType.TIER_FILTER,
  examboard: FilterType.EXAM_BOARD_FILTER,
  pathway: FilterType.PATHWAY_FILTER,
};

export const FACTOR_TO_COMPONENT: Record<
  GoogleClassroomFactorType,
  BrowseRefinedPayload["componentType"]
> = {
  tier: ComponentType.LEARNING_TIER_BUTTON,
  examboard: ComponentType.PROGRAMME_CARD,
  pathway: ComponentType.PROGRAMME_CARD,
};
