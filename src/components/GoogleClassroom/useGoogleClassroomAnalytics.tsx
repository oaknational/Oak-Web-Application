"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import type {
  FactorData,
  OnLessonAttachedData,
  ProgrammeFields,
  Subject,
  Unit,
  UnitData,
  Year,
} from "@oaknational/google-classroom-addon/ui";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useSearchParams } from "next/navigation";
import { useGoogleClassroomAddonStore } from "@oaknational/google-classroom-addon/ui";

import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  AnalyticsUseCase,
  type AnalyticsUseCaseValueType,
  ComponentType,
  EngagementIntent,
  EventVersion,
  FilterType,
  LessonReleaseCohort,
  type LessonReleaseCohortValueType,
  type TierNameValueType,
  type ExamBoardValueType,
  type PathwayValueType,
  Platform,
  Product,
  type ClientEnvironmentValueType,
} from "@/browser-lib/avo/Avo";
import type { LessonListingBrowseData } from "@/node-lib/curriculum-api-2023/queries/pupilLessonListing/pupilLessonListing.schema";
import {
  clearClassroomAddOnOpened,
  markClassroomAddOnNavigation,
  trackClassroomAddOnOpenedOnce,
} from "@/browser-lib/google-classroom/classroomAddonTracking";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";

type GoogleClassroomTrackFns = Pick<
  TrackFns,
  | "browseRefined"
  | "classroomLessonSelected"
  | "classroomLessonPreviewed"
  | "classroomAddOnOpened"
  | "classroomSignInStarted"
  | "classroomSignInCompleted"
  | "classroomLessonsAttached"
>;

type GoogleClassroomFactorType = "tier" | "examboard" | "pathway";

type GoogleClassroomAnalyticsContextData = {
  track: GoogleClassroomTrackFns;
  clientEnvironment: ClientEnvironmentValueType;
  googleLoginHint: string;
  courseId?: string;
  itemId?: string;
};

type GoogleClassroomAnalyticsSharedContext = Omit<
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

type GoogleClassroomAnalyticsStore = GoogleClassroomAnalyticsContextData &
  GoogleClassroomAnalyticsActions & {
    actions: GoogleClassroomAnalyticsActions;
    syncContext: (context: GoogleClassroomAnalyticsContextData) => void;
  };

type BrowseRefinedPayload = Parameters<
  GoogleClassroomTrackFns["browseRefined"]
>[0];
type LessonSelectedPayload = Parameters<
  GoogleClassroomTrackFns["classroomLessonSelected"]
>[0];
type LessonPreviewedPayload = Parameters<
  GoogleClassroomTrackFns["classroomLessonPreviewed"]
>[0];
type AddOnOpenedPayload = Parameters<
  GoogleClassroomTrackFns["classroomAddOnOpened"]
>[0];
type SignInStartedPayload = Parameters<
  GoogleClassroomTrackFns["classroomSignInStarted"]
>[0];
type SignInCompletedPayload = Parameters<
  GoogleClassroomTrackFns["classroomSignInCompleted"]
>[0];
type LessonsAttachedPayload = Parameters<
  GoogleClassroomTrackFns["classroomLessonsAttached"]
>[0];

const FACTOR_TO_FILTER: Record<
  GoogleClassroomFactorType,
  BrowseRefinedPayload["filterType"]
> = {
  tier: FilterType.TIER_FILTER,
  examboard: FilterType.EXAM_BOARD_FILTER,
  pathway: FilterType.PATHWAY_FILTER,
};

const FACTOR_TO_COMPONENT: Record<
  GoogleClassroomFactorType,
  BrowseRefinedPayload["componentType"]
> = {
  tier: ComponentType.LEARNING_TIER_BUTTON,
  examboard: ComponentType.PROGRAMME_CARD,
  pathway: ComponentType.PROGRAMME_CARD,
};

const buildBrowseRefinedPayload = (
  args: Pick<
    BrowseRefinedPayload,
    "componentType" | "filterType" | "filterValue" | "activeFilters"
  >,
  context: GoogleClassroomAnalyticsSharedContext,
): BrowseRefinedPayload => {
  return {
    platform: Platform.GOOGLE_CLASSROOM,
    product: Product.TEACHER_LESSON_RESOURCES,
    analyticsUseCase: AnalyticsUseCase.TEACHER,
    componentType: args.componentType,
    filterType: args.filterType,
    filterValue: args.filterValue,
    eventVersion: EventVersion["2_0_0"],
    engagementIntent: EngagementIntent.REFINE,
    activeFilters: args.activeFilters,
    googleLoginHint: context.googleLoginHint,
    clientEnvironment: context.clientEnvironment,
  };
};

const getLessonReleaseCohort = (
  isLegacy: boolean,
): LessonReleaseCohortValueType => {
  return isLegacy
    ? LessonReleaseCohort["2020_2023"]
    : LessonReleaseCohort["2023_2026"];
};

const buildLessonPayload = (
  args: GoogleClassroomLessonSelectionArgs,
  context: GoogleClassroomAnalyticsSharedContext,
): LessonSelectedPayload | LessonPreviewedPayload => {
  return {
    lessonName: args.lesson.lessonData.title,
    lessonSlug: args.lesson.lessonSlug,
    lessonReleaseCohort: getLessonReleaseCohort(args.lesson.isLegacy),
    lessonReleaseDate: args.lesson.lessonData.lessonReleaseDate ?? "unreleased",
    unitName: args.unitData?.title ?? "",
    unitSlug: args.lesson.unitSlug,
    tierName: (args.programmeFields?.tierDescription ??
      null) as TierNameValueType,
    examBoard: (args.programmeFields?.examboard ?? null) as ExamBoardValueType,
    pathway: (args.programmeFields?.pathway ?? null) as PathwayValueType,
    yearGroupName: args.programmeFields?.year ?? "",
    yearGroupSlug: args.programmeFields?.yearSlug ?? "",
    subjectTitle: args.programmeFields?.subject ?? "",
    subjectSlug: args.programmeFields?.subjectSlug ?? "",
    googleLoginHint: context.googleLoginHint,
    clientEnvironment: context.clientEnvironment,
  };
};

const buildAddOnOpenedPayload = (
  args: { analyticsUseCase: AnalyticsUseCaseValueType },
  context: GoogleClassroomAnalyticsSharedContext,
): AddOnOpenedPayload => {
  return {
    platform: Platform.GOOGLE_CLASSROOM,
    product: Product.GOOGLE_CLASSROOM_ADDON,
    engagementIntent: EngagementIntent.USE,
    componentType: ComponentType.PAGE_VIEW,
    eventVersion: EventVersion["2_0_0"],
    analyticsUseCase: args.analyticsUseCase,
    clientEnvironment: context.clientEnvironment,
  };
};

const buildSignInStartedPayload = (
  args: { analyticsUseCase: AnalyticsUseCaseValueType },
  context: GoogleClassroomAnalyticsSharedContext,
): SignInStartedPayload => {
  return {
    platform: Platform.GOOGLE_CLASSROOM,
    product: Product.GOOGLE_CLASSROOM_ADDON,
    analyticsUseCase: args.analyticsUseCase,
    googleLoginHint: context.googleLoginHint || null,
    clientEnvironment: context.clientEnvironment,
  };
};

const buildSignInCompletedPayload = (
  args: {
    analyticsUseCase: AnalyticsUseCaseValueType;
    subscribeToNewsletter: SignInCompletedPayload["subscribeToNewsletter"];
  },
  context: GoogleClassroomAnalyticsSharedContext,
): SignInCompletedPayload => {
  return {
    ...buildSignInStartedPayload(args, context),
    subscribeToNewsletter: args.subscribeToNewsletter,
  };
};

const buildLessonAttachedPayload = (
  data: OnLessonAttachedData,
  context: GoogleClassroomAnalyticsSharedContext,
): LessonsAttachedPayload => {
  return {
    lessonName: data.lessonName,
    unitName: data.unitName,
    courseId: data.courseId || context.courseId || "",
    itemId: data.itemId || context.itemId || "",
    gradeSyncEnabled: data.gradeSyncEnabled,
    googleLoginHint: data.googleLoginHint ?? context.googleLoginHint,
    clientEnvironment: context.clientEnvironment,
  };
};

const googleClassroomAnalyticsContext =
  createContext<StoreApi<GoogleClassroomAnalyticsStore> | null>(null);

const getSharedContext = (
  state: GoogleClassroomAnalyticsStore,
): GoogleClassroomAnalyticsSharedContext => {
  return {
    clientEnvironment: state.clientEnvironment,
    googleLoginHint: state.googleLoginHint,
    courseId: state.courseId,
    itemId: state.itemId,
  };
};

const createGoogleClassroomAnalyticsStore = (
  initialContext: GoogleClassroomAnalyticsContextData,
) => {
  return createStore<GoogleClassroomAnalyticsStore>()((set, get) => {
    const syncContext = (context: GoogleClassroomAnalyticsContextData) => {
      set(context);
    };

    const trackYearSelected = (year: Pick<Year, "yearSlug">) => {
      const state = get();

      state.track.browseRefined(
        buildBrowseRefinedPayload(
          {
            componentType: ComponentType.YEAR_GROUP_BUTTON,
            filterType: FilterType.YEAR_FILTER,
            filterValue: year.yearSlug,
            activeFilters: {},
          },
          getSharedContext(state),
        ),
      );
    };

    const trackSubjectSelected = (
      subject: Pick<Subject, "programmeFields">,
    ) => {
      const state = get();

      state.track.browseRefined(
        buildBrowseRefinedPayload(
          {
            componentType: ComponentType.SUBJECT_CARD,
            filterType: FilterType.SUBJECT_FILTER,
            filterValue: subject.programmeFields.subjectSlug ?? "",
            activeFilters: {},
          },
          getSharedContext(state),
        ),
      );
    };

    const trackOptionSelected = (
      factorType: GoogleClassroomFactorType,
      factor: Pick<FactorData, "factorSlug">,
    ) => {
      const state = get();

      state.track.browseRefined(
        buildBrowseRefinedPayload(
          {
            componentType: FACTOR_TO_COMPONENT[factorType],
            filterType: FACTOR_TO_FILTER[factorType],
            filterValue: factor.factorSlug ?? "",
            activeFilters: {
              tier: factorType === "tier" ? factor.factorSlug : undefined,
              examboard:
                factorType === "examboard" ? factor.factorSlug : undefined,
              pathway: factorType === "pathway" ? factor.factorSlug : undefined,
            },
          },
          getSharedContext(state),
        ),
      );
    };

    const trackUnitSelected = (unit: Pick<Unit, "unitSlug">) => {
      const state = get();

      state.track.browseRefined(
        buildBrowseRefinedPayload(
          {
            componentType: ComponentType.UNIT_CARD,
            filterType: FilterType.UNIT_FILTER,
            filterValue: unit.unitSlug,
            activeFilters: {},
          },
          getSharedContext(state),
        ),
      );
    };

    const trackLessonSelected = (args: GoogleClassroomLessonSelectionArgs) => {
      const state = get();
      state.track.classroomLessonSelected(
        buildLessonPayload(args, getSharedContext(state)),
      );
    };

    const trackLessonPreviewed = (args: GoogleClassroomLessonSelectionArgs) => {
      const state = get();
      state.track.classroomLessonPreviewed(
        buildLessonPayload(args, getSharedContext(state)),
      );
    };

    const trackAddOnOpened = (args: {
      analyticsUseCase: AnalyticsUseCaseValueType;
    }) => {
      const state = get();
      state.track.classroomAddOnOpened(
        buildAddOnOpenedPayload(args, getSharedContext(state)),
      );
    };

    const trackAddOnOpenedOnce = (args: {
      analyticsUseCase: AnalyticsUseCaseValueType;
    }) => {
      return trackClassroomAddOnOpenedOnce(() => {
        trackAddOnOpened(args);
      });
    };

    const trackSignInStarted = (args: {
      analyticsUseCase: AnalyticsUseCaseValueType;
    }) => {
      const state = get();
      state.track.classroomSignInStarted(
        buildSignInStartedPayload(args, getSharedContext(state)),
      );
    };

    const trackSignInCompleted = (args: {
      analyticsUseCase: AnalyticsUseCaseValueType;
      subscribeToNewsletter: SignInCompletedPayload["subscribeToNewsletter"];
    }) => {
      const state = get();
      state.track.classroomSignInCompleted(
        buildSignInCompletedPayload(args, getSharedContext(state)),
      );
    };

    const trackLessonAttached = (data: OnLessonAttachedData) => {
      const state = get();
      state.track.classroomLessonsAttached(
        buildLessonAttachedPayload(data, getSharedContext(state)),
      );
    };

    const markAddOnNavigation = () => {
      markClassroomAddOnNavigation();
    };

    const clearAddOnOpenedFlag = () => {
      clearClassroomAddOnOpened();
    };

    const actions: GoogleClassroomAnalyticsActions = {
      trackYearSelected,
      trackSubjectSelected,
      trackOptionSelected,
      trackUnitSelected,
      trackLessonSelected,
      trackLessonPreviewed,
      trackAddOnOpened,
      trackAddOnOpenedOnce,
      trackSignInStarted,
      trackSignInCompleted,
      trackLessonAttached,
      markAddOnNavigation,
      clearAddOnOpenedFlag,
    };

    return {
      ...initialContext,
      syncContext,
      actions,
      ...actions,
    };
  });
};

export function GoogleClassroomAnalyticsProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { track } = useAnalytics();
  const searchParams = useSearchParams();
  const addonCourseId = useGoogleClassroomAddonStore((state) => state.courseId);
  const addonItemId = useGoogleClassroomAddonStore((state) => state.itemId);
  const addonGoogleLoginHint = useGoogleClassroomAddonStore(
    (state) => state.googleLoginHint,
  );
  const courseId = addonCourseId ?? searchParams?.get("courseId") ?? undefined;
  const itemId = addonItemId ?? searchParams?.get("itemId") ?? undefined;
  const googleLoginHint =
    addonGoogleLoginHint ?? searchParams?.get("login_hint") ?? "";
  const clientEnvironment = getClientEnvironment();
  const storeRef = useRef<StoreApi<GoogleClassroomAnalyticsStore> | null>(null);

  storeRef.current ??= createGoogleClassroomAnalyticsStore({
    track: track as GoogleClassroomTrackFns,
    clientEnvironment,
    googleLoginHint,
    courseId,
    itemId,
  });

  useEffect(() => {
    storeRef.current?.getState().syncContext({
      track: track as GoogleClassroomTrackFns,
      clientEnvironment,
      googleLoginHint,
      courseId,
      itemId,
    });
  }, [track, clientEnvironment, googleLoginHint, courseId, itemId]);

  return (
    <googleClassroomAnalyticsContext.Provider value={storeRef.current}>
      {children}
    </googleClassroomAnalyticsContext.Provider>
  );
}

const defaultGoogleClassroomAnalyticsSelector = (
  state: GoogleClassroomAnalyticsStore,
): GoogleClassroomAnalyticsActions => {
  return state.actions;
};

export function useGoogleClassroomAnalytics(): GoogleClassroomAnalyticsActions;
export function useGoogleClassroomAnalytics<T>(
  selector: (state: GoogleClassroomAnalyticsStore) => T,
): T;
export function useGoogleClassroomAnalytics<T>(
  selector?: (state: GoogleClassroomAnalyticsStore) => T,
) {
  const store = useContext(googleClassroomAnalyticsContext);

  if (!store) {
    throw new Error(
      "useGoogleClassroomAnalytics called outside of GoogleClassroomAnalyticsProvider",
    );
  }

  return useStore(
    store,
    (selector ?? defaultGoogleClassroomAnalyticsSelector) as (
      state: GoogleClassroomAnalyticsStore,
    ) => T,
  );
}
