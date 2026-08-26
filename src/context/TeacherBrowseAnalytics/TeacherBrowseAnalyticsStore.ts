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

import type {
  ExamBoardValueType,
  KeyStageTitleValueType,
  PathwayValueType,
  LessonReleaseCohortValueType,
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
import { Thread, Unit } from "@/utils/curriculum/types";
import { buildUnitOverviewAccessedAnalytics } from "@/utils/curriculum/analytics";
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
    curriculumResourcesDownloaded: (data: ResourceFormValues) => void;
    curriculumResourcesDownloadRefined: (data: {
      tierSlug?: string | null;
      childSubjectSlug?: string | null;
    }) => void;
    lessonAccessed: (props: {
      componentType: ComponentTypeValueType;
      unitName: string;
      unitSlug: string;
      lessonName: string;
      lessonSlug: string;
      keyStageTitle: KeyStageTitleValueType;
      keyStageSlug: string;
      tierName: TierNameValueType | undefined;
      examBoard: ExamBoardValueType;
      pathway: PathwayValueType | undefined;
      lessonReleaseCohort: LessonReleaseCohortValueType;
      lessonReleaseDate: string;
      yearGroupName: string;
      yearGroupSlug: string;
    }) => void;
    curriculumResourcesAccessed: (data: {
      componentType: ComponentTypeValueType;
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
    programmeAccessed: (props: {
      componentType: ComponentTypeValueType;
      activeFilters: ActiveFilters;
      filterType: FilterTypeValueType;
      filterValue: string;
    }) => void;
    programmeRefined: (data: {
      componentType: ComponentTypeValueType;
      activeFilters: ActiveFilters;
      filterType: FilterTypeValueType;
      filterValue: string;
    }) => void;
    teachingMaterialsSelected: (props: {
      teachingMaterialType: TeachingMaterialTypeValueType;
    }) => void;
    unitAccessed: (props: {
      componentType: ComponentTypeValueType;
      yearGroupName: string;
      yearGroupSlug: string;
      keyStageTitle: KeyStageTitleValueType;
      keyStageSlug: string;
      subjectTitle: string;
      subjectSlug: string;
      unitName: string;
      unitSlug: string;
      tierName: TierNameValueType | undefined;
      examBoard: ExamBoardValueType;
      pathway: PathwayValueType | undefined;
    }) => void;
    unitDownloaded: () => void;
    unitDownloadStarted: () => void;
    unitOverviewAccessed: (
      unit: Unit,
      isHighlighted: boolean,
      selectedThread: Thread | undefined,
    ) => void;
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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "createTeachingMaterialsInitiated",
            programmeState,
          });
          return;
        }

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
      lessonAccessed: ({
        componentType,
        lessonName,
        lessonSlug,
        unitName,
        unitSlug,
        keyStageTitle,
        keyStageSlug,
        tierName,
        examBoard,
        pathway,
        lessonReleaseCohort,
        lessonReleaseDate,
        yearGroupName,
        yearGroupSlug,
      }) => {
        const { avo, programmeState } = get();

        const lessonState = programmeState
          ? requireLessonState("lessonAccessed", programmeState)
          : null;

        const analyticsProperties = lessonState
          ? getLessonAnalyticsProperties(lessonState)
          : {};

        avo.lessonAccessed({
          ...coreProperties,
          ...analyticsProperties,
          engagementIntent: EngagementIntent.REFINE,
          componentType,
          lessonName,
          lessonSlug,
          unitName,
          unitSlug,
          keyStageTitle,
          keyStageSlug,
          tierName,
          examBoard,
          pathway,
          lessonReleaseCohort,
          lessonReleaseDate,
          yearGroupName,
          yearGroupSlug,
        });
      },
      lessonMediaClipsStarted: (data) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "lessonMediaClipsStarted",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "lessonResourceDownloadStarted",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "lessonShareStarted",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "mediaClipsPlaylistPlayed",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "onwardContentSelected",
            programmeState,
          });
          return;
        }

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
      programmeAccessed: ({
        componentType,
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
          navigationType: "narrow",
          filterType,
          filterValue,
          activeFilters,
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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "teachingMaterialsSelected",
            programmeState,
          });
          return;
        }

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
      unitAccessed: ({
        componentType,
        yearGroupName,
        yearGroupSlug,
        keyStageTitle,
        keyStageSlug,
        subjectTitle,
        subjectSlug,
        unitName,
        unitSlug,
        tierName,
        examBoard,
        pathway,
      }) => {
        const { avo, programmeState } = get();

        const unitState = programmeState
          ? requireUnitState("unitAccessed", programmeState)
          : null;

        const analyticsProps = unitState
          ? getUnitAnalyticsProperties(unitState)
          : {};

        avo.unitAccessed({
          engagementIntent: EngagementIntent.REFINE,
          ...coreProperties,
          ...analyticsProps,
          componentType,
          yearGroupName,
          yearGroupSlug,
          keyStageTitle,
          keyStageSlug,
          subjectTitle,
          subjectSlug,
          unitName,
          unitSlug,
          tierName,
          examBoard,
          pathway,
        });
      },
      unitDownloaded: () => {
        const { avo, programmeState, journeyId, accessLevel } = get();

        if (programmeState?.browseLevel === "programme") {
          reportAnalyticsError({
            event: "unitDownloaded",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel === "programme") {
          reportAnalyticsError({
            event: "unitDownloadStarted",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "videoPlayed",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "videoStarted",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "videoPaused",
            programmeState,
          });
          return;
        }

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

        if (programmeState?.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "videoFinished",
            programmeState,
          });
          return;
        }

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
