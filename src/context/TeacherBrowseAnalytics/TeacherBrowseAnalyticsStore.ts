import { createStore } from "zustand";
import { capitalize } from "lodash";

import { TrackFns } from "../Analytics/AnalyticsProvider";

import { ProgrammeState } from "./teacherBrowseAnalytics.types";
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
  DownloadResourceButtonNameValueType,
  EngagementIntent,
  EventVersionValueType,
  LearningTierValueType,
  MediaClipsButtonNameValueType,
  PlatformValueType,
  ProductValueType,
  ResourceTypeValueType,
} from "@/browser-lib/avo/Avo";
import { Thread, Unit, CurriculumFilters } from "@/utils/curriculum/types";
import {
  buildUnitOverviewAccessedAnalytics,
  buildUnitSequenceRefinedAnalytics,
} from "@/utils/curriculum/analytics";
import { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import {
  getSchoolOption,
  getSchoolName,
  getSchoolUrn,
} from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/getFormattedDetailsForTracking";
import { convertUnitSlugToTitle } from "@/app/(core)/teachers/search/helpers";
import OakError from "@/errors/OakError";

export type TeacherBrowseAnalyticsStore = {
  programmeState: ProgrammeState;
  journeyId: string | null;
  avo: TrackFns;
  track: {
    lessonResourceDownloadStarted: (
      downloadResourceButtonName: DownloadResourceButtonNameValueType,
    ) => void;
    unitDownloaded: (accessLevel: AccessLevelValueType) => void;
    unitDownloadStarted: (accessLevel: AccessLevelValueType) => void;
    curriculumExplainerExplored: () => void;
    unitSequenceRefined: (data: {
      filters: CurriculumFilters;
      examBoardTitle?: string | null;
    }) => void;
    curriculumResourcesDownloadRefined: (data: {
      tierSlug?: string | null;
      childSubjectSlug?: string | null;
    }) => void;
    curriculumResourcesDownloaded: (data: ResourceFormValues) => void;
    programmeRefined: () => void;
    programmeAccessed: () => void;
    unitRefined: () => void;
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
    lessonShareStarted: () => void;
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
    "programmeState" | "avo" | "journeyId"
  >,
) => {
  return createStore<TeacherBrowseAnalyticsStore>()((_, get) => ({
    ...initialState,
    track: {
      lessonResourceDownloadStarted: (
        downloadResourceButtonName: DownloadResourceButtonNameValueType,
      ) => {
        const { avo, programmeState } = get();

        // Lesson properties are unavailable at other browse levels, so the
        // event can't be sent
        if (programmeState.browseLevel !== "lesson") {
          reportAnalyticsError({
            event: "lessonResourceDownloadStarted",
            programmeState,
            downloadResourceButtonName,
          });
          return;
        }

        const analyticsProperties =
          getLessonAnalyticsProperties(programmeState);

        avo.lessonResourceDownloadStarted({
          engagementIntent: EngagementIntent.USE,
          componentType: ComponentType.LESSON_DOWNLOAD_BUTTON,
          downloadResourceButtonName,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      unitDownloaded: (accessLevel) => {
        const { avo, programmeState, journeyId } = get();

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
      unitDownloadStarted: (accessLevel) => {
        const { avo, programmeState, journeyId } = get();

        // Can be tracked from the unit overview page or the lesson download success page
        if (programmeState.browseLevel === "programme") {
          reportAnalyticsError({ event: "unitDownloaded", programmeState });
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
      programmeRefined: () => {
        const { avo, journeyId, programmeState } = get();

        if (programmeState.browseLevel !== "programme") {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: {
                event: "programmeRefined",
                browseLevel: programmeState.browseLevel,
              },
            }),
          );
          return;
        }

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

        avo.programmeRefined({
          journeyId,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      programmeAccessed: () => {
        const { avo, journeyId, programmeState } = get();

        if (programmeState.browseLevel !== "programme") {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: {
                event: "programmeAccessed",
                browseLevel: programmeState.browseLevel,
              },
            }),
          );
          return;
        }

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

        if (!avo.programmeAccessed) {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: {
                event: "programmeAccessed",
                reason: "missingTrackFn",
              },
            }),
          );
          return;
        }

        avo.programmeAccessed({
          journeyId,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      unitOverviewAccessed: (unit, isHighlighted, selectedThread) => {
        const { avo, programmeState, journeyId } = get();

        if (programmeState.browseLevel !== "unit") {
          reportAnalyticsError({
            event: "unitOverviewAccessed",
            programmeState,
            unitSlug: unit.slug,
          });
          return;
        }

        const analyticsProperties = buildUnitOverviewAccessedAnalytics({
          unit,
          isHighlighted,
          componentType: "unit_info_button",
          selectedThread,
          analyticsUseCase: "Teacher",
          journeyId,
          accessLevel: "unit",
          navigationType: "across",
        });

        avo.unitOverviewAccessed(analyticsProperties);
      },
      unitSequenceRefined: ({ filters, examBoardTitle }) => {
        const { avo, programmeState, journeyId } = get();

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

        const filterProperties = buildUnitSequenceRefinedAnalytics(
          coreProperties.analyticsUseCase,
          {
            subjectSlug: programmeState.subjectSlug,
            subjectTitle: programmeState.subjectTitle,
            phaseSlug: programmeState.phaseSlug,
            ks4OptionTitle: examBoardTitle,
          },
          filters,
        );

        avo.unitSequenceRefined({
          ...filterProperties,
          ...coreProperties,
          ...analyticsProperties,
          journeyId,
        });
      },
      unitRefined: () => {
        const { avo, journeyId, programmeState } = get();

        if (programmeState.browseLevel !== "unit") {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: {
                event: "unitRefined",
                browseLevel: programmeState.browseLevel,
              },
            }),
          );
          return;
        }

        const analyticsProperties = getUnitAnalyticsProperties(programmeState);

        if (!avo.unitRefined) {
          reportError(
            new OakError({
              code: "analytics/teacher-browse",
              meta: {
                event: "unitRefined",
                reason: "missingTrackFn",
              },
            }),
          );
          return;
        }

        avo.unitRefined({
          journeyId,
          ...coreProperties,
          ...analyticsProperties,
        });
      },
      curriculumExplainerExplored: () => {
        const { avo, programmeState, journeyId } = get();

        const analyticsProperties =
          getProgrammeAnalyticsProperties(programmeState);

        avo.curriculumExplainerExplored({
          engagementIntent: "explore",
          componentType: "explainer_tab",
          journeyId,
          ...coreProperties,
          ...analyticsProperties,
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
    },
  }));
};
