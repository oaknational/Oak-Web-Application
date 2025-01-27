import { useState, useEffect } from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  OakFlex,
  OakThemeProvider,
  oakDefaultTheme,
} from "@oaknational/oak-components";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { LessonAppearsIn } from "@/components/TeacherComponents/LessonAppearsIn";
import { groupLessonPathways } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import { LessonOverview } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";
import OakError from "@/errors/OakError";
import { LessonOverviewCanonical } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";
import { populateLessonWithTranscript } from "@/utils/handleTranscript";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { TeacherNotesModal } from "@/components/TeacherComponents/TeacherNotesModal/TeacherNotesModal";
import { useShareExperiment } from "@/pages-helpers/teacher/share-experiments/useShareExperiment";
import { useTeacherNotes } from "@/pages-helpers/teacher/share-experiments/useTeacherNotes";
import { TeacherShareNotesButton } from "@/components/TeacherComponents/TeacherShareNotesButton/TeacherShareNotesButton";

type PageProps = {
  lesson: LessonOverviewCanonical;
  isSpecialist: boolean;
};

export type URLParams = {
  lessonSlug: string;
};

export default function LessonOverviewCanonicalPage({
  lesson,
  isSpecialist,
}: PageProps): JSX.Element {
  const [teacherNotesOpen, setTeacherNotesOpen] = useState(false);
  const [lessonPath, setLessonPath] = useState<string | null>(null);
  const teacherNotesEnabled = useFeatureFlagEnabled("teacher-notes");

  const { shareUrl, browserUrl, shareActivated, shareIdRef, shareIdKeyRef } =
    useShareExperiment({
      lessonSlug: lesson.lessonSlug,
      source: "lesson-canonical",
      curriculumTrackingProps: {
        lessonName: lesson.lessonTitle,
        unitName: null,
        subjectSlug: null,
        subjectTitle: null,
        keyStageSlug: null,
        keyStageTitle: null,
      },
      overrideExistingShareId:
        teacherNotesEnabled === undefined ? null : !teacherNotesEnabled,
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

  const pathwayGroups = groupLessonPathways(lesson.pathways);
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Lesson: ${lesson.lessonTitle}`,
          description: "Overview of lesson",
          canonicalURL: `${getBrowserConfig("seoAppUrl")}/teachers/lessons/${lesson.lessonSlug}`,
        }),
      }}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <LessonOverview
          lesson={{
            ...lesson,
            lessonMediaClips: null,
            isCanonical: true,
            isSpecialist,
            teacherShareButton: teacherNotesButton,
            teacherNoteHtml: teacherNoteHtml,
            teacherNoteError: error,
          }}
          isBeta={false}
        />
        {!isSpecialist && (
          <OakFlex $background={"pink50"} $width={"100%"}>
            <MaxWidth $pv={96}>
              <LessonAppearsIn headingTag="h2" {...pathwayGroups} />
            </MaxWidth>
          </OakFlex>
        )}
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
}

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

export const getStaticProps: GetStaticProps<PageProps, URLParams> = async (
  context,
): Promise<GetStaticPropsResult<PageProps>> => {
  return getPageProps({
    page: "lesson-overview-canonical::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context.params");
      }
      const { lessonSlug } = context.params;

      /**
       * If the lesson is not found in the specialist 2023 curriculum, try the non-specialist 2023 curriculum
       */

      let lesson;
      let isSpecialist = false;

      try {
        const res = await curriculumApi2023.specialistLessonOverviewCanonical({
          lessonSlug,
        });
        lesson = { ...res, isWorksheetLandscape: true, pathways: [] };
        isSpecialist = true;
      } catch (error) {
        if (
          error instanceof OakError &&
          error.code === "curriculum-api/not-found"
        ) {
          await new Promise((resolve) => setTimeout(resolve, 0)); // TODO: remove this
          lesson = await curriculumApi2023.lessonOverview({
            lessonSlug,
          });
          lesson = await populateLessonWithTranscript(lesson);
        }
      }

      if (!lesson) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<PageProps> = {
        props: {
          lesson,
          isSpecialist,
        },
      };

      return results;
    },
  });
};
