import { createStore } from "zustand";
import { capitalize } from "lodash";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import {
  CoreProgrammeState,
  NullableSearchResultContext,
  ProgrammeState,
  ProgrammeStateLesson,
  ProgrammeStateUnit,
  SearchResultContext,
  VideoTrackingProperties,
} from "./teacherBrowseAnalytics.types";
import {
  getLessonAnalyticsProperties,
  getProgrammeAnalyticsProperties,
  getUnitAnalyticsProperties,
} from "./utils/getAnalyticsProperties";
import { reportAnalyticsError } from "./utils/reportAnalyticsError";

import type {
  ExamBoardValueType,
  KeyStageTitleValueType,
  PathwayValueType,
  LessonReleaseCohortValueType,
  NavigationTypeValueType,
  SearchFilterMatchTypeValueType,
  SearchResultTypeValueType,
  SearchSourceValueType,
  ContextValueType,
} from "@/browser-lib/avo/Avo";
import {
  AccessLevelValueType,
  ActiveFilters,
  AnalyticsUseCaseValueType,
  ComponentType,
  ComponentTypeValueType,
  DownloadResourceButtonNameValueType,
  EngagementIntent,
  EventVersionValueType,
  FilterTypeValueType,
  LearningTierValueType,
  MediaClipsButtonNameValueType,
  OnwardIntentValueType,
  PlatformValueType,
  ProductValueType,
  TeachingMaterialTypeValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import getFormattedDetailsForTracking, {
  getSchoolOption,
  getSchoolName,
  getSchoolUrn,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { convertUnitSlugToTitle } from "@/app/(core)/teachers/search/helpers";
import { DOWNLOAD_TYPE_LABELS } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";

export type TeacherBrowseAnalyticsStore = {
  programmeState: ProgrammeState | null;
  journeyId: string | null;
  accessLevel: AccessLevelValueType;
  avo: TrackFns;
  track: {
    createTeachingMaterialsInitiated: (props: { isLoggedIn: boolean }) => void;
    curriculumExplainerExplored: () => void;
    curriculumResourcesAccessed: (data: {
      componentType: ComponentTypeValueType;
    }) => void;
    curriculumResourcesDownloaded: (data: ResourceFormValues) => void;
    curriculumResourcesDownloadRefined: (data: {
      tierSlug?: string | null;
      childSubjectSlug?: string | null;
    }) => void;
    lessonAccessed: (props: {
      componentType: ComponentTypeValueType;
      navigationType?: NavigationTypeValueType;
      lessonName: string;
      lessonSlug: string;
      lessonReleaseCohort: LessonReleaseCohortValueType;
      lessonReleaseDate: string;
      unitContext?: {
        unitName: string;
        unitSlug: string;
        keyStageTitle: KeyStageTitleValueType;
        keyStageSlug: string;
        tierName: TierNameValueType | undefined | null;
        examBoard: ExamBoardValueType | undefined | null;
        pathway: PathwayValueType | undefined | null;
        yearGroupName: string;
        yearGroupSlug: string;
      };
    }) => void;
    lessonAssistantAccessed: (props: { isLoggedIn: boolean }) => void;
    lessonMediaClipsStarted: (data: {
      mediaClipsButtonName: MediaClipsButtonNameValueType;
      learningCycle: string | null;
    }) => void;
    lessonResourcesDownloaded: (
      props: ResourceFormValues & {
        selectedResources: string[];
        onwardContent: string[];
        totalDownloadableResources: number;
      },
    ) => void;
    lessonResourceDownloadStarted: (data: {
      downloadResourceButtonName: DownloadResourceButtonNameValueType;
    }) => void;
    lessonShareStarted: () => void;
    mediaClipsPlaylistPlayed: (props: {
      learningCycle: string | null;
      durationSeconds: number;
      isCaptioned: boolean;
      videoPlaybackId: string[];
      videoTitle: string;
      timeElapsedSeconds: number;
      isMuted: boolean;
      mediaClipsCount: number;
      mediaClipIndex: number;
    }) => void;
    onwardContentSelected: (props: {
      lessonSlug: string;
      lessonName: string;
      lessonReleaseDate: string;
      onwardIntent: OnwardIntentValueType;
    }) => void;
    programmeAccessed: (props: {
      componentType: ComponentTypeValueType;
      navigationType?: NavigationTypeValueType;
      activeFilters?: ActiveFilters;
      filterType?: FilterTypeValueType;
      filterValue?: string;
    }) => void;
    programmeRefined: (data: {
      componentType: ComponentTypeValueType;
      activeFilters: ActiveFilters;
      filterType: FilterTypeValueType;
      filterValue: string;
    }) => void;
    searchJourneyInitiated: (props: {
      searchSource: SearchSourceValueType;
      context: ContextValueType;
    }) => void;
    searchAccessed: (props: {
      searchResultCount: number;
      searchResultsLoadTime: number;
      searchTerm: string;
      componentType: ComponentTypeValueType;
    }) => void;
    searchRefined: (props: {
      searchResultCount: number;
      activeFilters: Record<string, string>; // TD add filters to state
      searchTerm: string; // TD add query to state
      componentType: ComponentTypeValueType;
    }) => void;
    searchResultExpanded: (props: {
      searchRank: number;
      searchFilterOptionSelected: string[];
      searchResultCount: number;
      searchResultType: SearchResultTypeValueType;
      searchResultContext: SearchResultContext;
    }) => void;
    searchResultOpened: (props: {
      searchRank: number;
      searchFilterOptionSelected: string[];
      searchResultCount: number;
      searchResultType: SearchResultTypeValueType;
      searchResultContext: NullableSearchResultContext;
    }) => void;
    searchFilterModified: (props: {
      checked: boolean;
      filterType: FilterTypeValueType;
      filterValue: string;
      searchTerm: string; // TD move to state
      searchFilterMatchType: SearchFilterMatchTypeValueType;
    }) => void;
    teachWithOakAccessed: (data: {
      componentType: ComponentTypeValueType;
    }) => void;
    teachWithOakDownloaded: () => void;
    teachingMaterialsSelected: (props: {
      teachingMaterialType: TeachingMaterialTypeValueType;
    }) => void;
    unitAccessed: (props: {
      componentType: ComponentTypeValueType;
      navigationType?: NavigationTypeValueType;
      unitContext?: {
        unitName: string;
        unitSlug: string;
        tierName: TierNameValueType | undefined | null;
        examBoard: ExamBoardValueType | undefined | null;
        pathway: PathwayValueType | undefined | null;
        yearGroupName: string;
        yearGroupSlug: string;
        keyStageTitle: KeyStageTitleValueType;
        keyStageSlug: string;
        subjectTitle: string;
        subjectSlug: string;
      };
    }) => void;
    unitDownloaded: () => void;
    unitDownloadStarted: () => void;
    unitRefined: (props: {
      componentType: ComponentTypeValueType;
      activeFilters: ActiveFilters;
      filterType: FilterTypeValueType;
      filterValue: string;
    }) => void;
    videoPlayed: (props: VideoTrackingProperties) => void;
    videoStarted: (props: VideoTrackingProperties) => void;
    videoPaused: (props: VideoTrackingProperties) => void;
    videoFinished: (props: VideoTrackingProperties) => void;
  };
};

export const coreProperties: {
  platform: PlatformValueType;
  product: ProductValueType;
  eventVersion: EventVersionValueType;
  analyticsUseCase: AnalyticsUseCaseValueType;
} = {
  platform: "owa",
  product: "teacher lesson resources",
  eventVersion: "2.0.0",
  analyticsUseCase: "Teacher",
};

const sharedSearchProperties: {
  accessLevel: AccessLevelValueType;
  navigationType: NavigationTypeValueType;
} = {
  accessLevel: "search",
  navigationType: "narrow",
};

export const createTeacherBrowseAnalyticsStore = (
  initialState: Pick<
    TeacherBrowseAnalyticsStore,
    "programmeState" | "avo" | "journeyId" | "accessLevel"
  >,
) => {
  const requireProgrammeState = (
    event: keyof TeacherBrowseAnalyticsStore["track"],
    programmeState: ProgrammeState | null,
    meta?: Record<string, unknown>,
  ): CoreProgrammeState | null => {
    if (!programmeState) {
      reportAnalyticsError({ event, programmeState, ...meta });
      return null;
    }

    return programmeState;
  };

  const requireUnitState = (
    event: keyof TeacherBrowseAnalyticsStore["track"],
    programmeState: ProgrammeState | null,
    meta?: Record<string, unknown>,
  ): ProgrammeStateUnit | null => {
    if (!programmeState || programmeState.browseLevel === "programme") {
      reportAnalyticsError({ event, programmeState, ...meta });
      return null;
    }

    return programmeState;
  };

  const requireLessonState = (
    event: keyof TeacherBrowseAnalyticsStore["track"],
    programmeState: ProgrammeState | null,
    meta?: Record<string, unknown>,
  ): ProgrammeStateLesson | null => {
    if (programmeState?.browseLevel !== "lesson") {
      reportAnalyticsError({ event, programmeState, ...meta });
      return null;
    }

    return programmeState;
  };

  return createStore<TeacherBrowseAnalyticsStore>()((_, get) => ({
    ...initialState,
    track: {
      createTeachingMaterialsInitiated: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState(
          "createTeachingMaterialsInitiated",
          programmeState,
        );
        if (!lessonState) {
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(lessonState);
        avo.createTeachingMaterialsInitiated({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
          engagementIntent: "use",
          componentType: "create_more_with_ai_button",
        });
      },
      curriculumExplainerExplored: () => {
        const { avo, programmeState, journeyId } = get();

        const requiredProgrammeState = requireProgrammeState(
          "curriculumExplainerExplored",
          programmeState,
        );
        if (!requiredProgrammeState) {
          return;
        }

        const analyticsProperties = getProgrammeAnalyticsProperties(
          requiredProgrammeState,
        );

        avo.curriculumExplainerExplored({
          ...coreProperties,
          ...analyticsProperties,
          engagementIntent: "explore",
          componentType: "explainer_tab",
          journeyId,
          product: "curriculum resources",
        });
      },
      curriculumResourcesAccessed: ({ componentType }) => {
        const { avo, programmeState } = get();

        const requiredProgrammeState = requireProgrammeState(
          "curriculumResourcesAccessed",
          programmeState,
        );
        if (!requiredProgrammeState) {
          return;
        }

        const analyticsProperties = getProgrammeAnalyticsProperties(
          requiredProgrammeState,
        );

        avo.curriculumResourcesAccessed({
          ...coreProperties,
          ...analyticsProperties,
          engagementIntent: "explore",
          product: "curriculum resources",
          componentType,
        });
      },
      curriculumResourcesDownloaded: (data: ResourceFormValues) => {
        const { avo, programmeState, journeyId } = get();

        const requiredProgrammeState = requireProgrammeState(
          "curriculumResourcesDownloaded",
          programmeState,
        );
        if (!requiredProgrammeState) {
          return;
        }

        const analyticsProperties = getProgrammeAnalyticsProperties(
          requiredProgrammeState,
        );

        const schoolOption = getSchoolOption(data.school);

        const avoResourceType = data.resources.map((resource) => {
          return DOWNLOAD_TYPE_LABELS.find((label) => label.id === resource)!
            .avoResourceType;
        });

        avo.curriculumResourcesDownloaded({
          ...coreProperties,
          ...analyticsProperties,
          journeyId,
          engagementIntent: "explore",
          componentType: "download_button",
          product: "curriculum resources",
          emailSupplied: data.email != null,
          resourceType: avoResourceType,
          schoolOption,
          schoolName: getSchoolName(data.school, schoolOption),
          schoolUrn: getSchoolUrn(data.school, schoolOption),
          keyStageSlug: null,
          keyStageTitle: null,
        });
      },
      curriculumResourcesDownloadRefined: (data) => {
        const { avo, programmeState, journeyId } = get();
        const { tierSlug, childSubjectSlug } = data;

        const requiredProgrammeState = requireProgrammeState(
          "curriculumResourcesDownloadRefined",
          programmeState,
        );
        if (!requiredProgrammeState) {
          return;
        }

        const analyticsProperties = getProgrammeAnalyticsProperties(
          requiredProgrammeState,
        );

        avo.curriculumResourcesDownloadRefined({
          ...coreProperties,
          ...analyticsProperties,
          journeyId,
          engagementIntent: "refine",
          componentType: "download_tab",
          product: "curriculum resources",
          childSubjectSlug: childSubjectSlug || "",
          childSubjectName: convertUnitSlugToTitle(childSubjectSlug || ""),
          learningTier: capitalize(tierSlug || "") as LearningTierValueType,
        });
      },
      lessonAccessed: ({
        componentType,
        navigationType,
        lessonName,
        lessonSlug,
        unitContext,
        lessonReleaseCohort,
        lessonReleaseDate,
      }) => {
        const { avo, journeyId, accessLevel, programmeState } = get();
        const stateProps = {
          journeyId,
          accessLevel,
          componentType: componentType,
          navigationType: navigationType ?? "narrow",
          engagementIntent: EngagementIntent.REFINE,
          lessonReleaseCohort,
          lessonReleaseDate,
          lessonName,
          lessonSlug,
        };

        if (unitContext) {
          avo.lessonAccessed({
            ...coreProperties,
            ...unitContext,
            ...stateProps,
          });
        } else {
          const state = requireUnitState("lessonAccessed", programmeState);
          if (state) {
            const analyticsProperties = getUnitAnalyticsProperties(state);
            avo.lessonAccessed({
              ...coreProperties,
              ...analyticsProperties,
              ...stateProps,
            });
          }
        }
      },
      lessonAssistantAccessed: ({ isLoggedIn }: { isLoggedIn: boolean }) => {
        const { avo } = get();
        avo.lessonAssistantAccessed({
          product: "ai lesson assistant",
          isLoggedIn,
          componentType: "search_get_started_button",
        });
      },
      lessonMediaClipsStarted: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState(
          "lessonMediaClipsStarted",
          programmeState,
        );

        if (!lessonState) {
          return;
        }

        const analyticsProperties = getLessonAnalyticsProperties(lessonState);

        avo.lessonMediaClipsStarted({
          ...coreProperties,
          ...analyticsProperties,
          ...data,
          journeyId,
          engagementIntent: "use",
          componentType: "go_to_media_clips_page_button",
        });
      },
      lessonResourcesDownloaded: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState(
          "lessonResourcesDownloaded",
          programmeState,
        );
        if (!lessonState) {
          return;
        }

        const analyticsProperties = getLessonAnalyticsProperties(lessonState);

        const formattedSchool = getFormattedDetailsForTracking({
          school: data.school,
          selectedResources: data.selectedResources,
        });

        avo.lessonResourcesDownloaded({
          ...coreProperties,
          ...analyticsProperties,
          ...formattedSchool,
          journeyId,
          componentType: "lesson_download_button",
          engagementIntent: "use",
          emailSupplied: !!data.email,
          onwardContent: data.onwardContent,
          resourceType: formattedSchool.selectedResourcesForTracking,
          totalDownloadableResources: data.totalDownloadableResources,
        });
      },
      lessonResourceDownloadStarted: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState(
          "lessonResourceDownloadStarted",
          programmeState,
          {
            downloadResourceButtonName: data.downloadResourceButtonName,
          },
        );

        if (!lessonState) {
          return;
        }

        const analyticsProperties = getLessonAnalyticsProperties(lessonState);
        avo.lessonResourceDownloadStarted({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.LESSON_DOWNLOAD_BUTTON,
          ...data,
          journeyId,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      lessonShareStarted: () => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState(
          "lessonShareStarted",
          programmeState,
        );
        if (!lessonState) {
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(lessonState);

        avo.lessonShareStarted({
          ...coreProperties,
          ...analyticsProps,
          journeyId,
        });
      },
      mediaClipsPlaylistPlayed: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState(
          "mediaClipsPlaylistPlayed",
          programmeState,
        );

        if (!lessonState) {
          return;
        }

        const analyticsProperties = getLessonAnalyticsProperties(lessonState);
        avo.mediaClipsPlaylistPlayed({
          ...coreProperties,
          ...analyticsProperties,
          ...data,
          journeyId,
          engagementIntent: "use",
          componentType: "media_clips_played",
          videoLocation: "media clips",
        });
      },
      onwardContentSelected: (data) => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const unitState = requireUnitState(
          "onwardContentSelected",
          programmeState,
        );

        if (!unitState) {
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(unitState);

        avo.onwardContentSelected({
          ...coreProperties,
          ...analyticsProperties,
          ...data,
          journeyId,
          accessLevel,
          navigationType: "across",
          lessonReleaseCohort: "2023-2026",
        });
      },
      programmeAccessed: ({
        componentType,
        navigationType,
        activeFilters,
        filterType,
        filterValue,
      }) => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const analyticsProperties = programmeState
          ? getProgrammeAnalyticsProperties(programmeState)
          : {};

        avo.programmeAccessed({
          ...coreProperties,
          ...analyticsProperties,
          journeyId,
          accessLevel,
          engagementIntent: EngagementIntent.REFINE,
          componentType,
          navigationType: navigationType ?? "narrow",
          filterType,
          filterValue,
          activeFilters: activeFilters ?? {},
          googleLoginHint: null,
          clientEnvironment: null,
        });
      },
      programmeRefined: ({
        componentType,
        activeFilters,
        filterType,
        filterValue,
      }) => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const analyticsProperties = programmeState
          ? getProgrammeAnalyticsProperties(programmeState)
          : {};

        avo.programmeRefined({
          ...coreProperties,
          ...analyticsProperties,
          engagementIntent: "refine",
          navigationType: "narrow",
          googleLoginHint: null,
          clientEnvironment: null,
          activeFilters,
          filterType,
          filterValue,
          componentType,
          accessLevel,
          journeyId,
        });
      },
      searchJourneyInitiated: ({
        searchSource,
        context,
      }: {
        searchSource: SearchSourceValueType;
        context: ContextValueType;
      }) => {
        const { avo } = get();

        avo.searchJourneyInitiated({
          ...sharedSearchProperties,
          searchSource,
          context,
        });
      },
      searchAccessed: ({
        searchTerm,
        searchResultCount,
        searchResultsLoadTime,
        componentType,
      }: {
        searchTerm: string;
        searchResultCount: number;
        searchResultsLoadTime: number;
        componentType: ComponentTypeValueType;
      }) => {
        const { avo } = get();

        avo.searchAccessed({
          ...coreProperties,
          ...sharedSearchProperties,
          engagementIntent: "refine",
          componentType,
          searchTerm,
          searchResultCount,
          searchResultsLoadTime,
        });
      },
      searchRefined: (props: {
        searchResultCount: number;
        activeFilters: Record<string, string>;
        searchTerm: string;
        componentType: ComponentTypeValueType;
      }) => {
        const { avo } = get();

        avo.searchRefined({
          ...coreProperties,
          ...sharedSearchProperties,
          engagementIntent: "refine",
          ...props,
        });
      },
      searchResultExpanded: ({ searchResultContext, ...props }) => {
        const { avo } = get();

        avo.searchResultExpanded({
          ...coreProperties,
          ...sharedSearchProperties,
          ...searchResultContext,
          ...props,
          engagementIntent: "refine",
          componentType: "search_result_item",
          context: "search",
        });
      },
      searchResultOpened: ({ searchResultContext, ...props }) => {
        const { avo } = get();

        avo.searchResultOpened({
          analyticsUseCase: coreProperties.analyticsUseCase,
          ...sharedSearchProperties,
          ...searchResultContext,
          ...props,
          context: "search",
        });
      },
      searchFilterModified: ({ checked, ...props }) => {
        const { avo } = get();

        avo.searchFilterModified({
          ...coreProperties,
          ...props,
          ...sharedSearchProperties,
          accessLevel: "search",
          navigationType: "narrow",
          engagementIntent: "refine",
          componentType: "filter_link",
          filterModificationType: checked ? "remove" : "add",
        });
      },
      teachWithOakAccessed: ({ componentType }) => {
        const { avo, programmeState } = get();

        const analyticsProperties =
          programmeState?.browseLevel === "lesson"
            ? getLessonAnalyticsProperties(programmeState)
            : {
                lessonName: undefined,
                lessonSlug: undefined,
                lessonReleaseCohort: undefined,
                lessonReleaseDate: undefined,
                tierName: undefined,
                examBoard: undefined,
                pathway: undefined,
                unitName: undefined,
                unitSlug: undefined,
                keyStageTitle: undefined,
                keyStageSlug: undefined,
              };

        avo.teachWithOakAccessed({
          ...coreProperties,
          ...analyticsProperties,
          engagementIntent: EngagementIntent.EXPLORE,
          componentType,
        });
      },
      teachWithOakDownloaded: () => {
        const { avo } = get();
        avo.teachWithOakDownloaded({
          ...coreProperties,
          engagementIntent: EngagementIntent.USE,
          componentType: "download_button",
        });
      },
      teachingMaterialsSelected: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState(
          "teachingMaterialsSelected",
          programmeState,
        );

        if (!lessonState) {
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(lessonState);
        avo.teachingMaterialsSelected({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
          interactionId: "",
          engagementIntent: "use",
          componentType: "create_more_with_ai_dropdown",
        });
      },
      unitAccessed: ({ componentType, navigationType, unitContext }) => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const stateProps = {
          engagementIntent: EngagementIntent.REFINE,
          journeyId,
          accessLevel,
          navigationType: navigationType ?? "narrow",
          componentType,
          ...coreProperties,
        };

        if (unitContext) {
          avo.unitAccessed({
            ...stateProps,
            ...unitContext,
          });
        } else {
          const state = requireUnitState("unitAccessed", programmeState);
          if (state) {
            const analyticsProperties = getUnitAnalyticsProperties(state);
            avo.unitAccessed({
              ...stateProps,
              ...analyticsProperties,
            });
          }
        }
      },
      unitDownloaded: () => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const unitState = requireUnitState("unitDownloaded", programmeState);

        if (!unitState) {
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(unitState);

        avo.unitDownloaded({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.UNIT_DOWNLOAD_BUTTON,
          journeyId,
          accessLevel,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      unitDownloadStarted: () => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const unitState = requireUnitState(
          "unitDownloadStarted",
          programmeState,
        );

        if (!unitState) {
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(unitState);

        avo.unitDownloadStarted({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.UNIT_DOWNLOAD_BUTTON,
          journeyId,
          accessLevel,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      unitRefined: ({
        componentType,
        filterType,
        filterValue,
        activeFilters,
      }) => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const analyticsProperties =
          programmeState && programmeState.browseLevel !== "programme"
            ? getUnitAnalyticsProperties(programmeState)
            : {};

        avo.unitRefined({
          ...coreProperties,
          ...analyticsProperties,
          journeyId,
          accessLevel,
          engagementIntent: EngagementIntent.REFINE,
          componentType,
          navigationType: "narrow",
          filterType,
          filterValue,
          activeFilters,
          googleLoginHint: null,
          clientEnvironment: null,
        });
      },
      videoPlayed: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState("videoPlayed", programmeState);
        if (!lessonState) {
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(lessonState);
        avo.videoPlayed({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
        });
      },
      videoStarted: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState("videoStarted", programmeState);
        if (!lessonState) {
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(lessonState);
        avo.videoStarted({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
        });
      },
      videoPaused: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState("videoPaused", programmeState);
        if (!lessonState) {
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(lessonState);
        avo.videoPaused({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
        });
      },
      videoFinished: (data) => {
        const { avo, programmeState, journeyId } = get();

        const lessonState = requireLessonState("videoFinished", programmeState);
        if (!lessonState) {
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(lessonState);
        avo.videoFinished({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
        });
      },
    },
  }));
};
