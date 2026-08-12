import { createStore } from "zustand";
import { capitalize } from "lodash";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import {
  ProgrammeState,
  ProgrammeStateLesson,
  ProgrammeStateUnit,
  VideoTrackingProperties,
} from "./teacherBrowseAnalytics.types";
import {
  getLessonAnalyticsProperties,
  getProgrammeAnalyticsProperties,
  getUnitAnalyticsProperties,
} from "./utils/getAnalyticsProperties";
import { reportAnalyticsError } from "./utils/reportAnalyticsError";

import {
  AccessLevelValueType,
  AnalyticsUseCaseValueType,
  ComponentType as AvoComponentType,
  ComponentType,
  ComponentTypeValueType,
  DownloadResourceButtonNameValueType,
  EngagementIntent,
  EventVersionValueType,
  FilterType,
  FilterTypeValueType,
  LearningTierValueType,
  MediaClipsButtonNameValueType,
  OnwardIntentValueType,
  PlatformValueType,
  ProductValueType,
  ResourceTypeValueType,
  TeachingMaterialTypeValueType,
} from "@/browser-lib/avo/Avo";
import { Thread, Unit, CurriculumFilters } from "@/utils/curriculum/types";
import { buildUnitOverviewAccessedAnalytics } from "@/utils/curriculum/analytics";
import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import getFormattedDetailsForTracking, {
  getSchoolOption,
  getSchoolName,
  getSchoolUrn,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { convertUnitSlugToTitle } from "@/app/(core)/teachers/search/helpers";

export type TeacherBrowseAnalyticsStore = {
  programmeState: ProgrammeState | null;
  journeyId: string | null;
  accessLevel: AccessLevelValueType;
  avo: TrackFns;
  track: {
    createTeachingMaterialsInitiated: (props: { isLoggedIn: boolean }) => void;
    curriculumExplainerExplored: () => void;
    curriculumResourcesDownloaded: (data: ResourceFormValues) => void;
    curriculumResourcesDownloadRefined: (data: {
      tierSlug?: string | null;
      childSubjectSlug?: string | null;
    }) => void;
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
      onwardIntent: OnwardIntentValueType;
    }) => void;
    programmeAccessed: () => void;
    programmeRefined: (data: {
      componentType: ComponentTypeValueType;
      activeFilters: CurriculumFilters;
      filterType: FilterTypeValueType;
      filterValue: string;
    }) => void;
    teachingMaterialsSelected: (props: {
      teachingMaterialType: TeachingMaterialTypeValueType;
    }) => void;
    unitDownloaded: () => void;
    unitDownloadStarted: () => void;
    unitOverviewAccessed: (
      unit: Unit,
      isHighlighted: boolean,
      selectedThread: Thread | undefined,
    ) => void;
    unitRefined: () => void;
    videoPlayed: (props: VideoTrackingProperties) => void;
    videoStarted: (props: VideoTrackingProperties) => void;
    videoPaused: (props: VideoTrackingProperties) => void;
    videoFinished: (props: VideoTrackingProperties) => void;
  };
};

const coreProperties: {
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
  ): ProgrammeState | null => {
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

        avo.curriculumResourcesDownloaded({
          ...coreProperties,
          ...analyticsProperties,
          journeyId,
          engagementIntent: "explore",
          componentType: "download_button",
          product: "curriculum resources",
          emailSupplied: data.email != null,
          resourceType: ["curriculum document"] as ResourceTypeValueType[],
          schoolOption,
          schoolName: getSchoolName(data.school, schoolOption),
          schoolUrn: getSchoolUrn(data.school, schoolOption),
          keyStageSlug: null,
          keyStageTitle: null,
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

        const lessonState = requireLessonState(
          "onwardContentSelected",
          programmeState,
        );
        if (!lessonState) {
          return;
        }

        const analyticsProperties = getLessonAnalyticsProperties(lessonState);

        avo.onwardContentSelected({
          ...coreProperties,
          ...analyticsProperties,
          ...data,
          journeyId,
          accessLevel,
          navigationType: "narrow",
        });
      },
      programmeAccessed: () => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const analyticsProperties = programmeState
          ? getProgrammeAnalyticsProperties(programmeState)
          : {};

        avo.programmeAccessed({
          ...coreProperties,
          ...analyticsProperties,
          journeyId,
          accessLevel,
          engagementIntent: EngagementIntent.EXPLORE,
          componentType: AvoComponentType.PAGE_VIEW,
          navigationType: "narrow",
          filterType: FilterType.SUBJECT_FILTER,
          filterValue: "",
          activeFilters: {},
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
      unitOverviewAccessed: (unit, isHighlighted, selectedThread) => {
        const { avo, journeyId } = get();

        const analyticsProperties = buildUnitOverviewAccessedAnalytics({
          unit,
          isHighlighted,
          componentType: "unit_info_button",
          selectedThread,
          analyticsUseCase: "Teacher",
          journeyId,
          accessLevel: "programme",
          navigationType: "narrow",
        });

        avo.unitOverviewAccessed(analyticsProperties);
      },
      unitRefined: () => {
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
          componentType: AvoComponentType.UNIT_SEQUENCE_TAB,
          navigationType: "narrow",
          filterType: FilterType.CONTENT_TYPE_FILTER,
          filterValue: "units",
          activeFilters: {},
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
