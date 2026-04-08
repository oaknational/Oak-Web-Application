import type {
  FactorData,
  OnLessonAttachedData,
} from "@oaknational/google-classroom-addon/ui";
import { createStore } from "zustand/vanilla";

import {
  FACTOR_TO_COMPONENT,
  FACTOR_TO_FILTER,
  type GoogleClassroomAnalyticsActions,
  type GoogleClassroomAnalyticsContextData,
  type GoogleClassroomAnalyticsStore,
  type GoogleClassroomFactorType,
  type GoogleClassroomLessonSelectionArgs,
} from "./SharedTypes";
import {
  buildAddOnOpenedPayload,
  buildBrowseRefinedPayload,
  buildLessonAttachedPayload,
  buildLessonPayload,
  buildSignInCompletedPayload,
  buildSignInStartedPayload,
  getSharedContext,
  type SignInCompletedPayload,
} from "./TrackingFunctions";
import {
  clearClassroomAddOnOpened,
  markClassroomAddOnNavigation,
  trackClassroomAddOnOpenedOnce,
} from "./classroomAddonTracking";

import {
  type AnalyticsUseCaseValueType,
  ComponentType,
  FilterType,
} from "@/browser-lib/avo/Avo";

export const createGoogleClassroomAnalyticsStore = (
  initialContext: GoogleClassroomAnalyticsContextData,
) => {
  return createStore<GoogleClassroomAnalyticsStore>()((set, get) => {
    const syncContext = (context: GoogleClassroomAnalyticsContextData) => {
      set(context);
    };

    const trackYearSelected = (year: { yearSlug: string }) => {
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

    const trackSubjectSelected = (subject: {
      programmeFields: { subjectSlug?: string | null };
    }) => {
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

    const trackUnitSelected = (unit: { unitSlug: string }) => {
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

    const trackAddOnOpenedOnceAction = (args: {
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

    const actions: GoogleClassroomAnalyticsActions = {
      trackYearSelected,
      trackSubjectSelected,
      trackOptionSelected,
      trackUnitSelected,
      trackLessonSelected,
      trackLessonPreviewed,
      trackAddOnOpened,
      trackAddOnOpenedOnce: trackAddOnOpenedOnceAction,
      trackSignInStarted,
      trackSignInCompleted,
      trackLessonAttached,
      markAddOnNavigation: markClassroomAddOnNavigation,
      clearAddOnOpenedFlag: clearClassroomAddOnOpened,
    };

    return {
      ...initialContext,
      syncContext,
      actions,
      ...actions,
    };
  });
};
