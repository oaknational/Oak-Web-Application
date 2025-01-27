import React, { useEffect, useState } from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { useFeatureFlagEnabled } from "posthog-js/react";
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
import {
  useShareExperiment,
  CurriculumTrackingProps,
} from "@/pages-helpers/teacher/share-experiments/useShareExperiment";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { useTeacherNotes } from "@/pages-helpers/teacher/share-experiments/useTeacherNotes";
import { TeacherNotesModal } from "@/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal";
import { TeacherShareNotesButton } from "@/components/TeacherComponents/TeacherShareNotesButton/TeacherShareNotesButton";

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
    unitTitle,
    subjectSlug,
    keyStageTitle,
  } = curriculumData;

  const [teacherNotesOpen, setTeacherNotesOpen] = useState(false);
  const [lessonPath, setLessonPath] = useState<string | null>(null);
  const teacherNotesEnabled = useFeatureFlagEnabled("teacher-notes");

  const { shareUrl, browserUrl, shareActivated, shareIdKeyRef, shareIdRef } =
    useShareExperiment({
      lessonSlug,
      unitSlug,
      programmeSlug,
      source: "lesson-browse",
      curriculumTrackingProps: {
        lessonName: lessonTitle,
        unitName: unitTitle,
        subjectSlug,
        subjectTitle,
        keyStageSlug,
        keyStageTitle:
          keyStageTitle as CurriculumTrackingProps["keyStageTitle"],
      },
      overrideExistingShareId: true,
    });

  const { teacherNote, isEditable, saveTeacherNote, noteSaved, error } =
    useTeacherNotes({
      lessonPath,
      shareId: shareIdRef.current,
      sidKey: shareIdKeyRef.current,
      enabled: Boolean(teacherNotesEnabled),
    });

  useEffect(() => {
    if (teacherNotesEnabled) {
      setLessonPath(window.location.href.split("?")[0] || null);
    }

    if (window.location.href !== browserUrl) {
      window.history.replaceState({}, "", browserUrl);
    }
  }, [browserUrl, teacherNotesEnabled]);

  const teacherNotesButton = (
    <TeacherShareNotesButton
      teacherNotesEnabled={teacherNotesEnabled ?? false}
      isEditable={isEditable}
      noteSaved={noteSaved}
      setTeacherNotesOpen={setTeacherNotesOpen}
      shareUrl={shareUrl}
      shareActivated={shareActivated}
    />
  );

  const teacherNoteHtml =
    teacherNotesEnabled && !isEditable ? teacherNote?.noteHtml : undefined;

  const getLessonData = () => {
    if (tierTitle && examBoardTitle) {
      return ` | ${tierTitle} | ${examBoardTitle}`;
    } else if (tierTitle) {
      return ` | ${tierTitle}`;
    } else if (examBoardTitle) {
      return ` | ${examBoardTitle}`;
    } else return "";
  };

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lessonTitle}${getLessonData()} | ${keyStageSlug.toUpperCase()} ${subjectTitle}`,
          description:
            "View lesson content and choose resources to download or share",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}`,
        }),
      }}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
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

      const curriculumData = await curriculumApi2023.lessonOverview({
        programmeSlug,
        lessonSlug,
        unitSlug,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const lessonPageData = await populateLessonWithTranscript(curriculumData);

      const results: GetStaticPropsResult<LessonOverviewPageProps> = {
        props: {
          curriculumData: lessonPageData,
        },
      };

      return results;
    },
  });
};

export default LessonOverviewPage;
