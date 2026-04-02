"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  OakBox,
  OakFlex,
  OakLoadingSpinner,
  OakMaxWidth,
  OakP,
} from "@oaknational/oak-components";
import type { CourseWorkPupilProgress } from "@oaknational/google-classroom-addon/types";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { PupilViewsResults } from "@/components/PupilViews/PupilResults";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { LessonAttemptCamelCase } from "@/node-lib/pupil-api/types";
import { getLessonData } from "@/app/classroom/pupil/programmes/[programmeSlug]/[unitSlug]/[lessonSlug]/results/printable/getLessonData";

function mapCourseWorkProgressToAttempt(
  progress: CourseWorkPupilProgress,
  lessonTitle: string,
  lessonSlug: string,
  subject: string,
  yearDescription: string,
): LessonAttemptCamelCase {
  return {
    attemptId: progress.submissionId,
    createdAt: progress.createdAt,
    lessonData: { title: lessonTitle, slug: lessonSlug },
    browseData: { subject, yearDescription },
    sectionResults: {
      intro: progress.intro
        ? {
            worksheetDownloaded: progress.intro.worksheetDownloaded,
            worksheetAvailable: progress.intro.worksheetAvailable,
            isComplete: progress.intro.isComplete,
          }
        : undefined,
      "starter-quiz": progress.starterQuiz
        ? {
            grade: progress.starterQuiz.grade,
            numQuestions: progress.starterQuiz.numQuestions,
            questionResults: [],
          }
        : {},
      video: progress.video
        ? {
            isComplete: progress.video.isComplete,
            played: progress.video.played,
            duration: progress.video.duration,
            timeElapsed: progress.video.timeElapsed,
            muted: false,
            signedOpened: false,
            transcriptOpened: false,
          }
        : undefined,
      "exit-quiz": progress.exitQuiz
        ? {
            grade: progress.exitQuiz.grade,
            numQuestions: progress.exitQuiz.numQuestions,
            questionResults: [],
          }
        : {},
    },
  };
}

function CourseWorkResultsPage() {
  const searchParams = useSearchParams();
  const assignmentToken = searchParams?.get("assignmentToken");
  const submissionId = searchParams?.get("submissionId");

  const [browseData, setBrowseData] = React.useState<
    LessonBrowseData | undefined
  >();
  const [content, setContent] = React.useState<LessonContent | undefined>();
  const [attempt, setAttempt] = React.useState<
    LessonAttemptCamelCase | undefined
  >();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!assignmentToken || !submissionId) {
          setError("Missing assignmentToken or submissionId");
          setLoading(false);
          return;
        }

        const [lessonInfo, progress] = await Promise.all([
          googleClassroomApi.getCourseWorkLessonInfo(assignmentToken),
          googleClassroomApi.getCourseWorkPupilProgress(submissionId),
        ]);

        if (!lessonInfo) {
          setError("Assignment not found");
          setLoading(false);
          return;
        }
        if (!progress) {
          setError("No results found for this submission");
          setLoading(false);
          return;
        }

        const lessonData = await getLessonData(lessonInfo.lessonSlug);
        if (!lessonData) {
          setError("Lesson data not found");
          setLoading(false);
          return;
        }

        setBrowseData(lessonData.browseData);
        setContent(lessonData.content);
        setAttempt(
          mapCourseWorkProgressToAttempt(
            progress,
            lessonData.browseData.lessonData.title,
            lessonInfo.lessonSlug,
            lessonData.browseData.programmeFields.subject,
            lessonData.browseData.programmeFields.yearDescription,
          ),
        );
        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load results");
        setLoading(false);
      }
    };

    void load();
  }, [assignmentToken, submissionId]);

  if (loading) {
    return (
      <OakFlex $justifyContent="center" $alignItems="center" $minHeight="100vh">
        <OakLoadingSpinner $width="spacing-100" $color="icon-brand" />
      </OakFlex>
    );
  }

  if (error || !browseData || !content || !attempt) {
    return (
      <OakFlex $justifyContent="center" $alignItems="center" $minHeight="100vh">
        <OakP>{error ?? "Unable to load results"}</OakP>
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
            attemptData={attempt}
            starterQuizQuestionsArray={content.starterQuiz}
            exitQuizQuestionsArray={content.exitQuiz}
          />
        </MathJaxProvider>
      </OakMaxWidth>
    </OakBox>
  );
}

export default CourseWorkResultsPage;
