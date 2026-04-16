"use client";

import { Fragment, useState } from "react";
import {
  OakAnchorTarget,
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHandDrawnHR,
  OakHeading,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import LessonOverviewVideo from "@/components/TeacherComponents/LessonOverviewVideo";
import { getAnalyticsBrowseData } from "@/components/TeacherComponents/helpers/getAnalyticsBrowseData";
import PreviousNextNav from "@/components/TeacherComponents/PreviousNextNav/PreviousNextNav";
import { resolveOakHref } from "@/common-lib/urls";
import type { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";
import LessonOverviewPresentation from "@/components/TeacherComponents/LessonOverviewPresentation";
import LessonOverviewDocPresentation from "@/components/TeacherComponents/LessonOverviewDocPresentation";
import LessonOverviewMediaClips from "@/components/TeacherComponents/LessonOverviewMediaClips";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";
import LessonDetails from "@/components/TeacherComponents/LessonOverviewDetails";
import QuizContainerNew from "@/components/TeacherComponents/LessonOverviewQuizContainer";
import {
  createAttributionObject,
  getMediaClipLabel,
  LessonPageLinkAnchorId,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonOverviewQuizQuestion,
  StemObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import {
  getContainerId,
  getPreselectedDownloadFromTitle,
} from "@/components/TeacherComponents/LessonItemContainer/LessonItemContainer";
import {
  DownloadableLessonTitles,
  ResourceType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import { LessonItemContainerLink } from "@/components/TeacherComponents/LessonItemContainerLink";
import LessonPlayAllButton from "@/components/TeacherComponents/LessonPlayAllButton";
import { getIsResourceDownloadable } from "@/components/TeacherComponents/helpers/downloadAndShareHelpers/downloadsLegacyCopyright";

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

const ALLOWED_MATHJAX_SUBJECT_SLUGS = new Set([
  "maths",
  "physics",
  "chemistry",
  "biology",
  "combined-science",
  "science",
]);

const containsMathJax = (text: string | undefined | null): boolean => {
  if (!text) return false;
  const mathJaxPatterns = /(\$\$|\\\[|\\\(|\\begin\{)/;
  return mathJaxPatterns.test(text);
};

const findMathJaxInStemObjects = (answer: StemObject[]): boolean => {
  if (!answer) return false;
  return answer.some((a) => a.type === "text" && containsMathJax(a.text));
};

const hasAnswerMathJax = (question: LessonOverviewQuizQuestion): boolean => {
  const answers = question.answers;
  if (!answers) return false;

  if (
    answers["multiple-choice"]?.some((ans) =>
      findMathJaxInStemObjects(ans.answer),
    )
  ) {
    return true;
  }

  if (answers.match?.some((ans) => findMathJaxInStemObjects(ans.matchOption))) {
    return true;
  }

  if (answers.order?.some((ans) => findMathJaxInStemObjects(ans.answer))) {
    return true;
  }

  if (
    answers["short-answer"]?.some((ans) => findMathJaxInStemObjects(ans.answer))
  ) {
    return true;
  }

  return false;
};

const hasQuizMathJax = (
  quizData: LessonOverviewQuizQuestion[] | undefined,
): boolean => {
  return (
    quizData?.some((question) => {
      const stemCheck = question.questionStem?.some(
        (stem) => stem.type === "text" && containsMathJax(stem.text),
      );
      const answerCheck = hasAnswerMathJax(question);
      return stemCheck || answerCheck;
    }) ?? false
  );
};

const hasLessonMathJax = (data: TeachersLessonOverviewPageData): boolean => {
  const isLegacyLicense = false;

  if (
    (data.subjectSlug &&
      !ALLOWED_MATHJAX_SUBJECT_SLUGS.has(data.subjectSlug)) ||
    isLegacyLicense
  ) {
    return false;
  }

  if (
    data.contentGuidance?.some((cg) =>
      containsMathJax(cg.contentGuidanceDescription),
    )
  ) {
    return true;
  }
  if (
    data.misconceptionsAndCommonMistakes?.some(
      (mcm) =>
        containsMathJax(mcm.misconception) || containsMathJax(mcm.response),
    )
  ) {
    return true;
  }
  if (data.teacherTips?.some((tt) => containsMathJax(tt.teacherTip))) {
    return true;
  }
  if (
    data.keyLearningPoints?.some((klp) => containsMathJax(klp.keyLearningPoint))
  ) {
    return true;
  }
  if (
    data.lessonKeywords?.some(
      (kw) => containsMathJax(kw.keyword) || containsMathJax(kw.description),
    )
  ) {
    return true;
  }

  return (
    hasQuizMathJax(data.exitQuiz || []) ||
    hasQuizMathJax(data.starterQuiz || [])
  );
};

type LessonResource = {
  key: LessonPageLinkAnchorId;
  component: React.ReactNode;
  title: string;
  downloadable: boolean;
  downloadTitle?: string;
  isFinalElement?: boolean;
  skipLinkUrl?: string;
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

function getLessonResources({
  downloads,
  data,
  copyRightState,
  isMathJaxLesson,
}: {
  downloads: TeachersLessonOverviewPageData["downloads"];
  data: TeachersLessonOverviewPageData;
  copyRightState: ReturnType<typeof useComplexCopyright>;
  isMathJaxLesson: boolean;
}): LessonResource[] {
  const browsePathwayData = getAnalyticsBrowseData({
    keyStageSlug: data.keyStageSlug,
    keyStageTitle: data.keyStageTitle,
    subjectSlug: data.subjectSlug,
    subjectTitle: data.subjectTitle,
    unitSlug: data.unitSlug,
    unitTitle: data.unitTitle,
    year: data.year,
    yearTitle: data.yearTitle,
    examBoardTitle: data.examBoardTitle,
    tierTitle: data.tierTitle,
    pathwayTitle: data.pathwayTitle,
    lessonSlug: data.lessonSlug,
    lessonName: data.lessonTitle,
    lessonReleaseDate: data.lessonReleaseDate,
    isLegacy: false,
  });
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

function LessonItemContainer({
  resource,
  slugs,
}: Readonly<{
  resource: LessonResource;
  slugs: {
    lessonSlug: string;
    unitSlug: string | null;
    programmeSlug: string | null;
  };
}>) {
  const [skipResourceButtonFocused, setSkipResourceButtonFocused] =
    useState(false);
  const { title } = resource;
  const preselectedDownload = getPreselectedDownloadFromTitle(
    title as DownloadableLessonTitles,
  );
  // const preselectedShare = getPreselectedQueryFromTitle(
  //   title as DownloadableLessonTitles,
  // );

  const downloadTitle = resource.downloadTitle
    ? resource.downloadTitle
    : title.toLowerCase();
  return (
    <OakFlex
      $flexDirection="column"
      $position={"relative"}
      id={getContainerId(title)}
      tabIndex={-1}
    >
      <OakAnchorTarget id={resource.key} $pt={"spacing-24"} />
      <OakFlex
        $mb={
          resource.skipLinkUrl
            ? ["spacing-12", "spacing-24", "spacing-24"]
            : ["spacing-24"]
        }
        $position={"relative"}
        $flexDirection={"column"}
        $gap={"spacing-12"}
      >
        <OakFlex
          $flexDirection={["column", "row"]}
          $alignItems={["start", "end"]}
          $gap={["spacing-12", "spacing-40"]}
          $height={["auto", "spacing-40"]}
        >
          {title && (
            <OakHeading $font={["heading-5", "heading-4"]} tag={"h2"}>
              {title}
            </OakHeading>
          )}
          {resource.key === "media-clips" && slugs && (
            <LessonPlayAllButton {...slugs} />
          )}
          {resource.downloadable && slugs && (
            <LessonItemContainerLink
              page={"download"}
              resourceTitle={downloadTitle}
              onClick={() => {}}
              preselected={preselectedDownload}
              isSpecialist={false}
              {...slugs}
            />
          )}
          {/* {shareable && slugs && (
            <LessonItemContainerLink
              page={"share"}
              resourceTitle={downloadTitle}
              onClick={onDownloadButtonClick}
              preselected={preselectedShare}
              isSpecialist={props.isSpecialist}
              {...slugs}
            />
          )} */}

          {resource.skipLinkUrl && (
            <OakSecondaryButton
              element="a"
              href={resource.skipLinkUrl}
              onFocus={() => setSkipResourceButtonFocused(true)}
              onBlur={() => setSkipResourceButtonFocused(false)}
              style={
                skipResourceButtonFocused
                  ? {}
                  : {
                      position: "absolute",
                      left: "-1000px",
                      opacity: 0,
                    }
              }
            >
              {`Skip ${downloadTitle}`}
            </OakSecondaryButton>
          )}
        </OakFlex>
      </OakFlex>

      <OakBox>{resource.component}</OakBox>
      {!resource.isFinalElement && (
        <OakHandDrawnHR
          data-testid="hr"
          hrColor={"bg-decorative4-main"}
          $height={"spacing-4"}
          $mt={["spacing-24", "spacing-56"]}
          $mb={["spacing-12", "spacing-24"]}
        />
      )}
    </OakFlex>
  );
}

export default function LessonView(
  data: Readonly<TeachersLessonOverviewPageData>,
) {
  const copyRightState = useComplexCopyright({
    loginRequired: data.loginRequired,
    geoRestricted: data.geoRestricted,
  });
  const isMathJaxLesson = hasLessonMathJax(data);
  const MathJaxLessonProvider = isMathJaxLesson ? MathJaxProvider : Fragment;

  const lessonResources = getLessonResources({
    downloads: data.downloads,
    data,
    copyRightState,
    isMathJaxLesson,
  });

  return (
    <MathJaxLessonProvider>
      <OakBox $ph="spacing-40">
        <OakGrid
          $cg="spacing-16"
          $rg="spacing-56"
          $mb={["spacing-0", "spacing-48", "spacing-48"]}
          $mh="auto"
          $mt={["spacing-48", "spacing-56"]}
          $width={"100%"}
          $maxWidth={"spacing-1280"}
        >
          <OakGridArea
            $colSpan={[12, 3]}
            $alignSelf={"start"}
            $position={"sticky"}
            $display={["none", "block"]}
            $top={"spacing-92"} // FIXME: ideally we'd dynamically calculate this based on the height of the header using the next allowed size. This could be achieved with a new helperFunction get nextAvailableSize
          >
            {/* anchor links area */}
          </OakGridArea>
          <OakGridArea $colSpan={[12, 9]} $mb={"spacing-48"}>
            {lessonResources.map((resource) => (
              <LessonItemContainer
                slugs={{
                  lessonSlug: data.lessonSlug,
                  unitSlug: data.unitSlug,
                  programmeSlug: data.programmeSlug,
                }}
                resource={resource}
                key={resource.key}
              />
            ))}
            <PreviousNextNav
              backgroundColorLevel={1}
              currentIndex={data.orderInUnit ?? undefined}
              navItemType="lesson"
              previous={
                data.previousLesson
                  ? {
                      href: resolveOakHref({
                        page: "integrated-lesson-index",
                        programmeSlug: data.programmeSlug,
                        unitSlug: data.unitSlug,
                        lessonSlug: data.previousLesson.lessonSlug,
                      }),
                      title: data.previousLesson.lessonTitle,
                      index: data.previousLesson.lessonIndex,
                    }
                  : undefined
              }
              next={
                data.nextLesson
                  ? {
                      href: resolveOakHref({
                        page: "integrated-lesson-index",
                        programmeSlug: data.programmeSlug,
                        unitSlug: data.unitSlug,
                        lessonSlug: data.nextLesson.lessonSlug,
                      }),
                      title: data.nextLesson.lessonTitle,
                      index: data.nextLesson.lessonIndex,
                    }
                  : undefined
              }
            />
          </OakGridArea>
        </OakGrid>
      </OakBox>
    </MathJaxLessonProvider>
  );
}
