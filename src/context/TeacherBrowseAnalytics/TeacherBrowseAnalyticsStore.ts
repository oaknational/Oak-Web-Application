import { createStore } from "zustand";
import { capitalize } from "lodash";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import {
  ProgrammeState,
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
  programmeState: ProgrammeState;
  journeyId: string | null;
  accessLevel: AccessLevelValueType;
  avo: TrackFns;
  track: {
    lessonResourceDownloadStarted: (data: {
      downloadResourceButtonName: DownloadResourceButtonNameValueType;
    }) => void;
    unitDownloaded: () => void;
    unitDownloadStarted: () => void;
    curriculumExplainerExplored: () => void;
    programmeRefined: (data: {
      componentType: ComponentTypeValueType;
      activeFilters: CurriculumFilters;
      filterType: FilterTypeValueType;
      filterValue: string;
    }) => void;
    curriculumResourcesDownloadRefined: (data: {
      tierSlug?: string | null;
      childSubjectSlug?: string | null;
    }) => void;
    curriculumResourcesDownloaded: (data: ResourceFormValues) => void;
    unitOverviewAccessed: (
      unit: Unit,
      isHighlighted: boolean,
      selectedThread: Thread | undefined,
    ) => void;
    lessonMediaClipsStarted: (data: {
      mediaClipsButtonName: MediaClipsButtonNameValueType;
      learningCycle: string | null;
    }) => void;
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
    teachingMaterialsSelected: (props: {
      teachingMaterialType: TeachingMaterialTypeValueType;
    }) => void;
    lessonResourcesDownloaded: (
      props: ResourceFormValues & {
        selectedResources: string[];
        onwardContent: string[];
        totalDownloadableResources: number;
      },
    ) => void;
    lessonShareStarted: () => void;
    createTeachingMaterialsInitiated: (props: { isLoggedIn: boolean }) => void;
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
  return createStore<TeacherBrowseAnalyticsStore>()((_, get) => ({
    ...initialState,
    track: {
      lessonResourceDownloadStarted: (data) => {
        const { avo, programmeState, journeyId } = get();

        // Lesson properties are unavailable at other browse levels, so the
        // event can't be sent
        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "lessonResourceDownloadStarted",
            programmeState,
            downloadResourceButtonName: data.downloadResourceButtonName,
          });
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);
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

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "lessonResourcesDownloaded",
            programmeState,
          });
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

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
      unitDownloaded: () => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        // Can be tracked from the unit overview page or the lesson download success page
        if (programmeState.browseLevel === "programme") {
          reportAnalyticsError({ event: "unitDownloaded", programmeState });
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(programmeState);

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

        // Can be tracked from the unit overview page or the lesson download success page
        if (programmeState.browseLevel === "programme") {
          reportAnalyticsError({
            event: "unitDownloadStarted",
            programmeState,
          });
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(programmeState);

        avo.unitDownloadStarted({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.UNIT_DOWNLOAD_BUTTON,
          journeyId,
          accessLevel,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      onwardContentSelected: (data) => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "onwardContentSelected",
            programmeState,
          });
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

        avo.onwardContentSelected({
          ...coreProperties,
          ...analyticsProperties,
          ...data,
          journeyId,
          accessLevel,
          navigationType: "across",
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
      programmeRefined: ({
        componentType,
        activeFilters,
        filterType,
        filterValue,
      }) => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

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
      curriculumExplainerExplored: () => {
        const { avo, programmeState, journeyId } = get();

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

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

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

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

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

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

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "lessonMediaClipsStarted",
            programmeState,
          });
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

        avo.lessonMediaClipsStarted({
          ...coreProperties,
          ...analyticsProperties,
          ...data,
          journeyId,
          engagementIntent: "use",
          componentType: "go_to_media_clips_page_button",
        });
      },
      mediaClipsPlaylistPlayed: (data) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "mediaClipsPlaylistPlayed",
            programmeState,
          });
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);
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
      lessonShareStarted: () => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({ event: "lessonShareStarted", programmeState });
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(programmeState);

        avo.lessonShareStarted({
          ...coreProperties,
          ...analyticsProps,
          journeyId,
        });
      },
      createTeachingMaterialsInitiated: (data) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "createTeachingMaterialsInitiated",
            programmeState,
          });
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(programmeState);
        avo.createTeachingMaterialsInitiated({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
          engagementIntent: "use",
          componentType: "create_more_with_ai_button",
        });
      },
      teachingMaterialsSelected: (data) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "teachingMaterialsSelected",
            programmeState,
          });
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(programmeState);
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
      videoPlayed: (data) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "videoPlayed",
            programmeState,
          });
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(programmeState);
        avo.videoPlayed({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
        });
      },
      videoStarted: (data) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "videoStarted",
            programmeState,
          });
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(programmeState);
        avo.videoStarted({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
        });
      },
      videoPaused: (data) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "videoPaused",
            programmeState,
          });
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(programmeState);
        avo.videoPaused({
          ...coreProperties,
          ...analyticsProps,
          ...data,
          journeyId,
        });
      },
      videoFinished: (data) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "videoFinished",
            programmeState,
          });
          return;
        }

        const analyticsProps = getLessonAnalyticsProperties(programmeState);
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
