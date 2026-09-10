import { capitalize } from "lodash";

import {
  ExamBoardValueType,
  KeyStageTitleValueType,
  LessonReleaseCohortValueType,
  PathwayValueType,
  PhaseValueType,
  TierNameValueType,
} from "@/browser-lib/avo/Avo";
import errorReporter from "@/common-lib/error-reporter";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { unionOrNull } from "@/utils/narrowToUnion";

export type PupilPathwayData = {
  unitName: string;
  unitSlug: string;
  lessonSlug: string;
  lessonName: string;
  keyStageSlug: string;
  keyStageTitle: KeyStageTitleValueType;
  subjectTitle: string;
  subjectSlug: string;
  yearGroupName: string;
  yearGroupSlug: string;
  phase: PhaseValueType;
  tierName: TierNameValueType | null | undefined;
  pathway: PathwayValueType | null | undefined;
  examBoard: ExamBoardValueType | null | undefined;
  releaseGroup: string;
  lessonReleaseCohort: LessonReleaseCohortValueType;
  lessonReleaseDate: string;
};

// TODO: The assumptions behind these types seem wrong. We currently have one video per lesson, but if we have multiple videos they are likely to have multiple titles, slugs, etc.
export type PupilVideoData = {
  videoTitle: string;
  numberOfVideos: number;
  videoSlug: string[];
  isCaptioned: boolean;
  videoPlaybackId: string[];
  signedAvailable: boolean;
};

export const generateKeyStageTitle = (
  keystageDescription: string,
): KeyStageTitleValueType => {
  const k = keystageDescription.replace("Stage", "stage");

  const keyStageTitle = k as KeyStageTitleValueType;

  if (!keyStageTitle) {
    console.error("Invalid key stage title", k);
    const error = new Error("Invalid key stage title");
    errorReporter(
      "pupils::pupilAnalyticsHelpers::getPupilPathwayData::invalidKeyStageTitle",
    )(error, {
      severity: "warning",
      keyStageTitle: k,
    });
  }
  return keyStageTitle;
};

export const getPupilPathwayData = (
  browseData: LessonBrowseData,
): PupilPathwayData => {
  const keyStageTitle = generateKeyStageTitle(
    browseData.programmeFields.keystageDescription,
  );
  if (browseData.programmeFields.phase === "foundation") {
    throw new Error("Foundation phase is not supported");
  }

  return {
    unitName: browseData.unitData.title ?? "",
    unitSlug: browseData.unitData.slug,
    lessonSlug: browseData.lessonData.slug,
    lessonName: browseData.lessonData.title,
    keyStageSlug: browseData.programmeFields.keystageSlug,
    keyStageTitle,
    subjectTitle: browseData.programmeFields.subject,
    subjectSlug: browseData.programmeFields.subjectSlug,
    yearGroupName: browseData.programmeFields.year,
    yearGroupSlug: browseData.programmeFields.yearSlug,
    phase: browseData.programmeFields.phase,
    tierName: unionOrNull<TierNameValueType>(
      capitalize(browseData.programmeFields.tier ?? undefined),
      ["Higher", "Foundation", "Core"],
    ),
    examBoard: browseData.programmeFields.examboard,
    releaseGroup: browseData.isLegacy ? "legacy" : "2023",
    lessonReleaseCohort: browseData.isLegacy ? "2020-2023" : "2023-2026",
    lessonReleaseDate: browseData.lessonData.lessonReleaseDate ?? "unpublished",
    pathway: browseData.programmeFields.pathway,
  };
};

export const getPupilVideoData = (
  lessonContent: LessonContent,
): PupilVideoData => {
  return {
    videoTitle: lessonContent.videoTitle ?? "",
    numberOfVideos: 1,
    videoSlug: [lessonContent.lessonSlug], //FIXME: this is misleading and duplicates the pathway data
    isCaptioned: lessonContent.transcriptSentences.length > 0,
    videoPlaybackId: [
      lessonContent.videoMuxPlaybackId || "",
      lessonContent.videoWithSignLanguageMuxPlaybackId || "",
    ],
    signedAvailable: !!lessonContent.videoWithSignLanguageMuxPlaybackId,
  };
};
