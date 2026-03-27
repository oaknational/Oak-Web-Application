import type { OnLessonAttachedData } from "@oaknational/google-classroom-addon/ui";

import type {
  GoogleClassroomAnalyticsSharedContext,
  GoogleClassroomAnalyticsStore,
  GoogleClassroomLessonSelectionArgs,
  GoogleClassroomTrackFns,
} from "./SharedTypes";

import {
  AnalyticsUseCase,
  type AnalyticsUseCaseValueType,
  ComponentType,
  EngagementIntent,
  EventVersion,
  LessonReleaseCohort,
  type LessonReleaseCohortValueType,
  type TierNameValueType,
  type ExamBoardValueType,
  type PathwayValueType,
  Platform,
  Product,
} from "@/browser-lib/avo/Avo";

export type BrowseRefinedPayload = Parameters<
  GoogleClassroomTrackFns["browseRefined"]
>[0];
export type LessonSelectedPayload = Parameters<
  GoogleClassroomTrackFns["classroomLessonSelected"]
>[0];
export type LessonPreviewedPayload = Parameters<
  GoogleClassroomTrackFns["classroomLessonPreviewed"]
>[0];
export type AddOnOpenedPayload = Parameters<
  GoogleClassroomTrackFns["classroomAddOnOpened"]
>[0];
export type SignInStartedPayload = Parameters<
  GoogleClassroomTrackFns["classroomSignInStarted"]
>[0];
export type SignInCompletedPayload = Parameters<
  GoogleClassroomTrackFns["classroomSignInCompleted"]
>[0];
export type LessonsAttachedPayload = Parameters<
  GoogleClassroomTrackFns["classroomLessonsAttached"]
>[0];

export const getSharedContext = (
  state: GoogleClassroomAnalyticsStore,
): GoogleClassroomAnalyticsSharedContext => {
  return {
    clientEnvironment: state.clientEnvironment,
    googleLoginHint: state.googleLoginHint,
    courseId: state.courseId,
    itemId: state.itemId,
  };
};

export const getLessonReleaseCohort = (
  isLegacy: boolean,
): LessonReleaseCohortValueType => {
  return isLegacy
    ? LessonReleaseCohort["2020_2023"]
    : LessonReleaseCohort["2023_2026"];
};

export const buildBrowseRefinedPayload = (
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

export const buildLessonPayload = (
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

export const buildAddOnOpenedPayload = (
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

export const buildSignInStartedPayload = (
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

export const buildSignInCompletedPayload = (
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

export const buildLessonAttachedPayload = (
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
