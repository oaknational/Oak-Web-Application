import {
  DOWNLOAD_TYPES_BY_RESOURCE,
  DISPLAY_TITLES_BY_RESOURCE,
  TRACKING_TITLES_BY_RESOURCE,
  DOWNLOAD_TITLES_BY_RESOURCE,
  SKIPPABLE_CONTENT_SECTIONS,
} from "./lessonResourceConstants";

import { getIsResourceDownloadable } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadsLegacyCopyright";
import {
  LessonPageLinkAnchorId,
  LessonResourceType,
  createAttributionObject,
  getMediaClipLabel,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import LessonOverviewDocPresentation from "@/components/TeacherComponents/LessonOverviewDocPresentation";
import LessonOverviewMediaClips, {
  TrackingCallbackProps,
} from "@/components/TeacherComponents/LessonOverviewMediaClips";
import LessonOverviewPresentation from "@/components/TeacherComponents/LessonOverviewPresentation";
import LessonOverviewVideo from "@/components/TeacherComponents/LessonOverviewVideo";
import { DownloadableLessonTitles } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { LessonItemTitle } from "@/components/TeacherComponents/LessonItemContainer";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import LessonDetails from "@/components/TeacherComponents/LessonOverviewDetails";
import QuizContainerNew from "@/components/TeacherComponents/LessonOverviewQuizContainer";
import { DownloadResourceButtonNameValueType } from "@/browser-lib/avo/Avo";
import { AnalyticsBrowseData } from "@/components/TeacherComponents/types/lesson.types";

/**
 * Checks if a resource is downloadable based on its type and available downloads.
 * A resource is downloadable if ANY of its associated download types are available.
 */
const checkResourceDownloadable = (
  resourceType: LessonResourceType,
  downloads: TeachersLessonOverviewPageData["downloads"],
): boolean => {
  const downloadTypes = DOWNLOAD_TYPES_BY_RESOURCE[resourceType];
  if (!downloadTypes || downloadTypes.length === 0) {
    return false;
  }
  return downloadTypes.some((type) =>
    getIsResourceDownloadable(type, downloads),
  );
};

export type LessonResource = {
  /** The type of resource - identifies what this resource is */
  resourceType: LessonResourceType;
  /** The DOM anchor ID for navigation - may differ from resourceType for quiz grouping */
  anchorId: LessonPageLinkAnchorId;
  component: React.ReactNode;
  skipLinkUrl?: string;
  trackingTitle?: DownloadResourceButtonNameValueType;
} & (
  | {
      downloadable: true;
      downloadTitle: string;
      title: DownloadableLessonTitles;
    }
  | {
      downloadable: false;
      downloadTitle?: never;
      title: LessonItemTitle;
    }
);

const getSkipLinkUrl = ({
  resource,
  index,
  isFinalElement,
  lessonResources,
  lessonSlug,
}: {
  resource: LessonResource;
  index: number;
  isFinalElement: boolean;
  lessonResources: LessonResource[];
  lessonSlug?: string;
}): string | undefined => {
  if (!lessonSlug) {
    return undefined;
  }

  if (!SKIPPABLE_CONTENT_SECTIONS.has(resource.resourceType)) {
    return undefined;
  }

  // If this is the last resource, skip to the footer
  if (isFinalElement) {
    return `${lessonSlug}#site-footer`;
  }

  const nextResource = lessonResources[index + 1];
  if (!nextResource) {
    return undefined;
  }

  return `${lessonSlug}#${nextResource.anchorId}`;
};

export function getLessonResources({
  browsePathwayData,
  data,
  copyrightState,
  isMathJaxLesson,
  trackMediaClipsButtonClicked,
  contentRestricted,
}: {
  browsePathwayData: AnalyticsBrowseData;
  data: TeachersLessonOverviewPageData;
  copyrightState: ReturnType<typeof useComplexCopyright>;
  isMathJaxLesson: boolean;
  trackMediaClipsButtonClicked: (props: TrackingCallbackProps) => void;
  contentRestricted: boolean;
}): LessonResource[] {
  const lessonGuide = data.lessonGuideUrl ? (
    <LessonOverviewDocPresentation
      asset={data.lessonGuideUrl}
      title={data.lessonTitle}
      isWorksheetLandscape={true}
      docType="lesson guide"
    />
  ) : undefined;
  const presentation = data.presentationUrl ? (
    <LessonOverviewPresentation
      asset={data.presentationUrl}
      title={data.lessonTitle}
      isWorksheet={false}
    />
  ) : undefined;
  const mediaClips = data.hasMediaClips ? (
    <LessonOverviewMediaClips
      lessonSlug={data.lessonSlug}
      learningCycleVideos={data.lessonMediaClips}
      isCanonical={false}
      unitSlug={data.unitSlug}
      programmeSlug={data.programmeSlug}
      lessonOutline={data.lessonOutline}
      isPELesson={!!data.actions?.displayPETitle}
      isMFL={!!data.actions?.displayVocabButton}
      onTrackingCallback={trackMediaClipsButtonClicked}
    />
  ) : undefined;
  const lessonDetails = (
    <LessonDetails
      loginRequired={data.loginRequired}
      georestricted={data.geoRestricted}
      keyLearningPoints={data.keyLearningPoints}
      learningOutcome={data.pupilLessonOutcome}
      commonMisconceptions={data.misconceptionsAndCommonMistakes}
      keyWords={data.lessonKeywords?.length ? data.lessonKeywords : undefined}
      slugs={{
        lessonSlug: data.lessonSlug,
        unitSlug: data.unitSlug,
        programmeSlug: data.programmeSlug,
      }}
      teacherTips={data.teacherTips}
      equipmentAndResources={data.lessonEquipmentAndResources}
      contentGuidance={data.contentGuidance}
      supervisionLevel={data.supervisionLevel}
      isLegacyLicense={false}
      isMathJaxLesson={isMathJaxLesson}
      hasVocabAndTranscripts={Boolean(data.additionalMaterialUrl)}
      displayVocab={!!data.actions?.displayVocabButton}
      updatedAt={data.updatedAt}
      additionalFiles={data.additionalFiles}
      year={data.yearGroupTitle}
      subject={data.subjectTitle}
      keystage={data.keyStageTitle}
      keystageSlug={data.keyStageSlug}
      unit={data.unitTitle}
      lesson={data.lessonTitle}
      examBoardSlug={data.examBoardSlug}
      subjectSlug={data.subjectSlug}
      subjectParent={data.subjectParent}
      phaseSlug={data.phaseSlug}
      disablePupilLink={data.actions?.disablePupilShare}
      hideSeoHelper={copyrightState.showGeoBlocked}
      useIntegratedJourneyLayout
    />
  );
  const lessonVideo = data.videoMuxPlaybackId ? (
    <LessonOverviewVideo
      video={data.videoMuxPlaybackId}
      signLanguageVideo={data.videoWithSignLanguageMuxPlaybackId}
      title={data.lessonTitle}
      transcriptSentences={data.transcriptSentences}
      isLegacy={false}
      browsePathwayData={browsePathwayData}
    />
  ) : undefined;
  const worksheet = data.worksheetUrl ? (
    <LessonOverviewPresentation
      asset={data.worksheetUrl}
      title={data.lessonTitle}
      isWorksheetLandscape={!!data.isWorksheetLandscape}
      isWorksheet={true}
    />
  ) : undefined;
  const starterQuiz = data.starterQuiz ? (
    <QuizContainerNew
      questions={data.starterQuiz}
      imageAttribution={createAttributionObject(data.starterQuiz)}
      isMathJaxLesson={isMathJaxLesson}
    />
  ) : undefined;
  const exitQuiz = data.exitQuiz ? (
    <QuizContainerNew
      questions={data.exitQuiz}
      imageAttribution={createAttributionObject(data.exitQuiz)}
      isMathJaxLesson={isMathJaxLesson}
    />
  ) : undefined;
  const additionalMaterial = data.additionalMaterialUrl ? (
    <LessonOverviewDocPresentation
      asset={data.additionalMaterialUrl}
      title={data.lessonTitle}
      isWorksheetLandscape={false}
      docType="additional material"
    />
  ) : undefined;
  const mediaClipLabel = data.subjectSlug
    ? getMediaClipLabel(data.subjectSlug)
    : DISPLAY_TITLES_BY_RESOURCE["media-clips"];

  // Map of resource types to their components
  const resourceComponents: Record<
    LessonResourceType,
    React.ReactNode | undefined
  > = {
    "lesson-guide": lessonGuide,
    "slide-deck": presentation,
    "media-clips": mediaClips,
    "lesson-details": lessonDetails,
    video: lessonVideo,
    worksheet: worksheet,
    "starter-quiz": starterQuiz,
    "exit-quiz": exitQuiz,
    "additional-material": additionalMaterial,
  };

  // Define the order of resources as displayed on the page
  const resourceOrder: LessonResourceType[] = [
    "lesson-guide",
    "slide-deck",
    "media-clips",
    "lesson-details",
    "video",
    "worksheet",
    "starter-quiz",
    "exit-quiz",
    "additional-material",
  ];

  return resourceOrder
    .map((resourceType) => {
      const isDownloadable = checkResourceDownloadable(
        resourceType,
        data.downloads,
      );
      const downloadTitle = DOWNLOAD_TITLES_BY_RESOURCE[resourceType];
      const title =
        resourceType === "media-clips"
          ? mediaClipLabel
          : DISPLAY_TITLES_BY_RESOURCE[resourceType];

      const baseResource = {
        resourceType,
        component: resourceComponents[resourceType],
        trackingTitle: TRACKING_TITLES_BY_RESOURCE[resourceType],
      };

      return isDownloadable && downloadTitle
        ? {
            ...baseResource,
            downloadable: true as const,
            downloadTitle,
            title: title as DownloadableLessonTitles,
          }
        : {
            ...baseResource,
            downloadable: false as const,
            title: title,
          };
    })
    .filter((item) => item.component !== undefined)

    .map((item, _index, array) => {
      // Add anchorId for quiz grouping - the first quiz gets "quiz" anchor when both exist
      const hasStarterQuiz = array.some(
        (r) => r.resourceType === "starter-quiz",
      );
      const hasExitQuiz = array.some((r) => r.resourceType === "exit-quiz");
      const hasBothQuizzes = hasStarterQuiz && hasExitQuiz;
      const isFirstQuiz =
        item.resourceType === "starter-quiz" ||
        (item.resourceType === "exit-quiz" && !hasStarterQuiz);

      const anchorId: LessonPageLinkAnchorId =
        hasBothQuizzes && isFirstQuiz ? "quiz" : item.resourceType;

      return {
        ...item,
        anchorId,
      };
    })
    .map((item, index, array) => {
      const isFinalElement = index === array.length - 1;
      const skipLinkUrl = getSkipLinkUrl({
        resource: item,
        index,
        lessonSlug: data.lessonSlug,
        isFinalElement,
        lessonResources: array as LessonResource[],
      });
      return {
        ...item,
        skipLinkUrl,
      };
    })
    .filter((item) => {
      // Only show lesson details when content is restricted
      if (contentRestricted) {
        return item.anchorId === "lesson-details";
      }
      return true;
    });
}
