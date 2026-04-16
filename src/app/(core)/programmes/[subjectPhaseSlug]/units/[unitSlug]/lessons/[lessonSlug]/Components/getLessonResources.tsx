import { getIsResourceDownloadable } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadsLegacyCopyright";
import {
  LessonPageLinkAnchorId,
  createAttributionObject,
  getMediaClipLabel,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import LessonOverviewDocPresentation from "@/components/TeacherComponents/LessonOverviewDocPresentation";
import LessonOverviewMediaClips from "@/components/TeacherComponents/LessonOverviewMediaClips";
import LessonOverviewPresentation from "@/components/TeacherComponents/LessonOverviewPresentation";
import LessonOverviewVideo from "@/components/TeacherComponents/LessonOverviewVideo";
import { ResourceType } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import LessonDetails from "@/components/TeacherComponents/LessonOverviewDetails";
import QuizContainerNew from "@/components/TeacherComponents/LessonOverviewQuizContainer";
import { AnalyticsBrowseData } from "@/components/TeacherComponents/types/lesson.types";
import { DownloadResourceButtonNameValueType } from "@/browser-lib/avo/Avo";

/**
 * Maps each lesson resource key to its associated download types.
 * Resources with empty arrays are not downloadable.
 */
const RESOURCE_DOWNLOAD_MAP: Record<LessonPageLinkAnchorId, ResourceType[]> = {
  "lesson-guide": ["lesson-guide-pdf"],
  "slide-deck": ["presentation"],
  "media-clips": [],
  "lesson-details": [],
  video: [],
  worksheet: ["worksheet-pdf", "worksheet-pptx"],
  "starter-quiz": ["intro-quiz-answers", "intro-quiz-questions"],
  "exit-quiz": ["exit-quiz-answers", "exit-quiz-questions"],
  "additional-material": ["supplementary-docx", "supplementary-pdf"],
  quiz: [], // Legacy quiz type - not directly downloadable
};

/**
 * Maps resource keys to their display titles
 */
const RESOURCE_TITLES: Record<
  Exclude<LessonPageLinkAnchorId, "quiz">,
  string
> = {
  "lesson-guide": "Lesson guide",
  "slide-deck": "Lesson slides",
  "media-clips": "Video & audio clips", // Default, may be overridden by subject
  "lesson-details": "Lesson details",
  video: "Lesson video",
  worksheet: "Worksheet",
  "starter-quiz": "Prior knowledge starter quiz",
  "exit-quiz": "Assessment exit quiz",
  "additional-material": "Additional material",
};

const RESOURCE_TRACKING_TITLES: Partial<
  Record<LessonPageLinkAnchorId, DownloadResourceButtonNameValueType>
> = {
  worksheet: "worksheet",
  "slide-deck": "slide deck",
  "starter-quiz": "starter quiz",
  "exit-quiz": "exit quiz",
  "additional-material": "additional material",
  "lesson-guide": "lesson guide",
};

/**
 * Maps resource keys to their custom download titles (if different from display title)
 */
const RESOURCE_DOWNLOAD_TITLES: Partial<
  Record<LessonPageLinkAnchorId, string>
> = {
  "starter-quiz": "quiz pdf",
  "exit-quiz": "quiz pdf",
};

/**
 * Checks if a resource is downloadable based on its key and available downloads.
 * A resource is downloadable if ANY of its associated download types are available.
 */
const checkResourceDownloadable = (
  resourceKey: LessonPageLinkAnchorId,
  downloads: TeachersLessonOverviewPageData["downloads"],
): boolean => {
  const downloadTypes = RESOURCE_DOWNLOAD_MAP[resourceKey];
  if (!downloadTypes || downloadTypes.length === 0) {
    return false;
  }
  return downloadTypes.some((type) =>
    getIsResourceDownloadable(type, downloads),
  );
};

export type LessonResource = {
  key: LessonPageLinkAnchorId;
  component: React.ReactNode;
  title: string;
  downloadable: boolean;
  downloadTitle?: string;
  isFinalElement?: boolean;
  skipLinkUrl?: string;
  trackingTitle?: DownloadResourceButtonNameValueType;
};

const SKIPPABLE_CONTENT_SECTIONS: Set<LessonPageLinkAnchorId> = new Set([
  "video",
  "lesson-guide",
  "worksheet",
  "slide-deck",
  "starter-quiz",
  "exit-quiz",
  "media-clips",
  "additional-material",
]);

const getSkipLinkUrl = ({
  anchorId,
  index,
  isFinalElement,
  lessonResources,
  lessonSlug,
}: {
  anchorId: LessonPageLinkAnchorId;
  index: number;
  isFinalElement: boolean;
  lessonResources: LessonResource[];
  lessonSlug?: string;
}): string | undefined => {
  if (!lessonSlug) {
    return undefined;
  }

  if (!SKIPPABLE_CONTENT_SECTIONS.has(anchorId)) {
    return undefined;
  }

  if (index === -1) {
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

  return `${lessonSlug}#${nextResource.key}`;
};

export function getLessonResources({
  browsePathwayData,
  downloads,
  data,
  copyRightState,
  isMathJaxLesson,
}: {
  browsePathwayData: AnalyticsBrowseData;
  downloads: TeachersLessonOverviewPageData["downloads"];
  data: TeachersLessonOverviewPageData;
  copyRightState: ReturnType<typeof useComplexCopyright>;
  isMathJaxLesson: boolean;
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
  const mediaClips = data.lessonMediaClips?.length ? (
    <LessonOverviewMediaClips
      lessonSlug={data.lessonSlug}
      learningCycleVideos={data.lessonMediaClips}
      isCanonical={false}
      unitSlug={data.unitSlug}
      programmeSlug={data.programmeSlug}
      lessonOutline={data.lessonOutline}
      isPELesson={!!data.actions?.displayPETitle}
      isMFL={!!data.actions?.displayVocabButton}
      onTrackingCallback={() => {}}
    />
  ) : undefined;
  const lessonDetails = (
    <LessonDetails
      loginRequired={data.loginRequired}
      geoRestricted={data.geoRestricted}
      keyLearningPoints={data.keyLearningPoints}
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
      year={data.yearTitle}
      subject={data.subjectTitle}
      keystage={data.keyStageTitle}
      unit={data.unitTitle}
      lesson={data.lessonTitle}
      examBoardSlug={data.examBoardSlug}
      subjectSlug={data.subjectSlug}
      subjectParent={data.subjectParent}
      disablePupilLink={data.actions?.disablePupilShare}
      hideSeoHelper={copyRightState.showGeoBlocked}
    />
  );
  const lessonVideo = (
    <LessonOverviewVideo
      video={data.videoMuxPlaybackId}
      signLanguageVideo={data.videoWithSignLanguageMuxPlaybackId}
      title={data.lessonTitle}
      transcriptSentences={data.transcriptSentences}
      isLegacy={false}
      browsePathwayData={browsePathwayData}
    />
  );
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
    : RESOURCE_TITLES["media-clips"];

  // Map of resource keys to their components
  const resourceComponents: Record<
    Exclude<LessonPageLinkAnchorId, "quiz">,
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
  const resourceOrder: Exclude<LessonPageLinkAnchorId, "quiz">[] = [
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
    .map((key) => ({
      key,
      component: resourceComponents[key],
      title: key === "media-clips" ? mediaClipLabel : RESOURCE_TITLES[key],
      downloadable: checkResourceDownloadable(key, downloads),
      downloadTitle: RESOURCE_DOWNLOAD_TITLES[key],
      trackingTitle: RESOURCE_TRACKING_TITLES[key],
    }))
    .filter((item) => item.component)
    .map((item, index, array) => {
      const isFinalElement = index === array.length - 1;
      const skipLinkUrl = getSkipLinkUrl({
        anchorId: item.key,
        index,
        lessonSlug: data.lessonSlug,
        isFinalElement,
        lessonResources: array,
      });
      return {
        ...item,
        isFinalElement,
        skipLinkUrl,
      };
    });
}
