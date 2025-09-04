import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";

import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { populateLessonWithTranscript } from "@/utils/handleTranscript";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { TeacherNotesModal } from "@/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal";
import { useLesson } from "@/pages-helpers/teacher/useLesson/useLesson";
import { CurriculumTrackingProps } from "@/pages-helpers/teacher/share-experiments/shareExperimentTypes";
import { allowNotFoundError } from "@/pages-helpers/shared/lesson-pages/allowNotFoundError";
import { getRedirect } from "@/pages-helpers/shared/lesson-pages/getRedirects";
import Banners from "@/components/SharedComponents/Banners";
import { convertQuestionMath } from "@/pages-helpers/shared/lesson-pages/mathjax";

export type LessonOverviewPageProps = {
  curriculumData: LessonOverviewPageData;
};

const LessonOverviewPage: NextPage<LessonOverviewPageProps> = ({
  curriculumData,
}) => {
  const {
    lessonTitle,
    keyStageSlug,
    subjectTitle,
    tierTitle,
    examBoardTitle,
    lessonSlug,
    unitSlug,
    programmeSlug,
    year,
    unitTitle,
    subjectSlug,
    keyStageTitle,
    isLegacy,
    lessonReleaseDate,
    loginRequired,
    geoRestricted,
  } = curriculumData;

  const {
    teacherNotesButton,
    teacherNoteHtml,
    teacherNotesOpen,
    setTeacherNotesOpen,
    teacherNote,
    isEditable,
    saveTeacherNote,
    shareUrl,
    error,
    shareActivated,
  } = useLesson({
    lessonSlug,
    unitSlug,
    programmeSlug,
    source: "lesson-browse",
    loginRequired,
    geoRestricted,
    curriculumTrackingProps: {
      lessonName: lessonTitle,
      lessonSlug: lessonSlug,
      unitName: unitTitle,
      unitSlug: unitSlug,
      subjectSlug,
      subjectTitle,
      keyStageSlug,
      keyStageTitle: keyStageTitle as CurriculumTrackingProps["keyStageTitle"],
      lessonReleaseCohort: isLegacy ? "2020-2023" : "2023-2026",
      lessonReleaseDate: lessonReleaseDate ?? "unreleased",
    },
  });

  const getLessonData = () => {
    if (tierTitle && examBoardTitle) {
      return ` ${tierTitle} ${examBoardTitle}`;
    } else if (tierTitle) {
      return ` ${tierTitle}`;
    } else if (examBoardTitle) {
      return ` ${examBoardTitle}`;
    } else return "";
  };

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `${lessonTitle}${getLessonData()} ${keyStageSlug.toUpperCase()} | Y${year} ${subjectTitle} Lesson Resources`,
          description:
            "View lesson content and choose resources to download or share",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}`,
        }),
      }}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <Banners hideIfFeatureFlagDisabled />
        <LessonOverview
          lesson={{
            ...curriculumData,
            isCanonical: false,
            isSpecialist: false,
            teacherShareButton: teacherNotesButton,
            teacherNoteHtml,
            teacherNoteError: error,
          }}
          isBeta={false}
        />
        {teacherNote && isEditable && (
          <TeacherNotesModal
            isOpen={teacherNotesOpen}
            onClose={() => {
              setTeacherNotesOpen(false);
            }}
            teacherNote={teacherNote}
            saveTeacherNote={saveTeacherNote}
            sharingUrl={shareUrl}
            error={error}
            shareActivated={shareActivated}
          />
        )}
      </OakThemeProvider>
    </AppLayout>
  );
};

export type URLParams = {
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  LessonOverviewPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "lesson-overview::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug, unitSlug, programmeSlug } = context.params;

      let curriculumData;
      let lessonPageData;
      try {
        curriculumData = await curriculumApi2023.lessonOverview({
          programmeSlug,
          lessonSlug,
          unitSlug,
        });
        lessonPageData = await populateLessonWithTranscript(curriculumData);
      } catch (innerError) {
        allowNotFoundError(innerError);
      }

      if (!lessonPageData) {
        const redirect = await getRedirect({
          isCanonical: false,
          context: context.params,
          isTeacher: true,
          isLesson: true,
        });
        return redirect ? { redirect } : { notFound: true };
      }

      const results: GetStaticPropsResult<LessonOverviewPageProps> = {
        props: {
          curriculumData: {
            ...lessonPageData,
            starterQuiz: convertQuestionMath(lessonPageData.starterQuiz),
            exitQuiz: convertQuestionMath(lessonPageData.exitQuiz),
          },
        },
      };

      return results;
    },
  });
};

export default LessonOverviewPage;
