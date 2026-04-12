"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  OakBox,
  OakFlex,
  OakLoadingSpinner,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { CourseWorkPupilProgress } from "@oaknational/google-classroom-addon/types";

import { getLessonData } from "@/app/classroom/pupil/programmes/[programmeSlug]/[unitSlug]/[lessonSlug]/results/printable/getLessonData";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { PupilViewsResults } from "@/components/PupilViews/PupilResults/PupilResults.view";
import { LessonAttemptCamelCase } from "@/node-lib/pupil-api/types";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { QuestionResultCamelCase } from "@/node-lib/pupil-api/types/lessonAttempt";

type ResultsData = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  pupilProgress: CourseWorkPupilProgress | null;
};

function mapToAttemptData(
  progress: CourseWorkPupilProgress,
  lessonTitle: string,
  lessonSlug: string,
  subject: string,
  yearDescription: string,
): LessonAttemptCamelCase {
  const mapQuiz = (quiz?: CourseWorkPupilProgress["starterQuiz"]) => {
    if (!quiz) return {};
    return {
      grade: quiz.grade,
      numQuestions: quiz.numQuestions,
      questionResults: (quiz.questionResults ?? []).map(
        (qr): QuestionResultCamelCase => ({
          offerHint: qr.usedHint ?? false,
          grade: qr.grade,
          mode: qr.mode as QuestionResultCamelCase["mode"],
          pupilAnswer: qr.pupilAnswer as QuestionResultCamelCase["pupilAnswer"],
          feedback: qr.feedback as QuestionResultCamelCase["feedback"],
          correctAnswer:
            qr.correctAnswer as QuestionResultCamelCase["correctAnswer"],
          isPartiallyCorrect: qr.isPartiallyCorrect,
        }),
      ),
    };
  };

  return {
    attemptId: `${progress.submissionId}:${progress.assignmentToken}`,
    createdAt: progress.createdAt,
    lessonData: { title: lessonTitle, slug: lessonSlug },
    browseData: { subject, yearDescription },
    sectionResults: {
      intro: {
        worksheetDownloaded: progress.intro?.worksheetDownloaded ?? false,
        worksheetAvailable: progress.intro?.worksheetAvailable ?? false,
        isComplete: progress.intro?.isComplete ?? false,
      },
      "starter-quiz": mapQuiz(progress.starterQuiz),
      video: {
        isComplete: progress.video?.isComplete ?? false,
        played: progress.video?.played ?? false,
        duration: progress.video?.duration ?? -1,
        timeElapsed: progress.video?.timeElapsed ?? -1,
        muted: false,
        signedOpened: false,
        transcriptOpened: false,
      },
      "exit-quiz": mapQuiz(progress.exitQuiz),
    },
  };
}

function CourseWorkResultsPage() {
  const searchParams = useSearchParams();
  const [browseData, setBrowseData] = React.useState<LessonBrowseData>();
  const [content, setContent] = React.useState<LessonContent>();
  const [attemptData, setAttemptData] =
    React.useState<LessonAttemptCamelCase>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const assignmentToken = searchParams?.get("assignmentToken");
        const submissionId = searchParams?.get("submissionId");

        if (!assignmentToken || !submissionId) {
          setError("Missing assignmentToken or submissionId");
          setLoading(false);
          return;
        }

        const params = new URLSearchParams({ assignmentToken, submissionId });
        const res = await fetch(
          `/api/classroom/coursework/results?${params.toString()}`,
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch results: ${res.status}`);
        }

        const data: ResultsData = await res.json();

        if (!data.pupilProgress) {
          setError("No results found for this submission");
          setLoading(false);
          return;
        }

        const lessonData = await getLessonData(data.lessonSlug);
        if (!lessonData) {
          setError("Lesson data not found");
          setLoading(false);
          return;
        }

        setBrowseData(lessonData.browseData);
        setContent(lessonData.content);
        setAttemptData(
          mapToAttemptData(
            data.pupilProgress,
            lessonData.browseData.lessonData.title,
            data.lessonSlug,
            lessonData.browseData.programmeFields.subject,
            lessonData.browseData.programmeFields.yearDescription ?? "",
          ),
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [searchParams]);

  if (loading) {
    return (
      <OakFlex $justifyContent="center" $alignItems="center" $minHeight="100vh">
        <OakLoadingSpinner $width="spacing-100" $color="icon-brand" />
      </OakFlex>
    );
  }

  if (error || !browseData || !content || !attemptData) {
    return (
      <OakFlex $justifyContent="center" $alignItems="center" $minHeight="100vh">
        <p>{error ?? "Unable to load results"}</p>
      </OakFlex>
    );
  }

  return (
    <OakBox $background="bg-primary" $width="100%" $minHeight="100vh">
      <OakMaxWidth
        $pv="spacing-80"
        $ph="spacing-12"
        $mv="spacing-12"
        $maxWidth="spacing-1280"
        $mh="auto"
      >
        <MathJaxProvider>
          <PupilViewsResults
            browseData={browseData}
            attemptData={attemptData}
            starterQuizQuestionsArray={content.starterQuiz}
            exitQuizQuestionsArray={content.exitQuiz}
          />
        </MathJaxProvider>
      </OakMaxWidth>
    </OakBox>
  );
}

export default CourseWorkResultsPage;
