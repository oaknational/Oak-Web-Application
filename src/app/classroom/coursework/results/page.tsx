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

import { mapToAttemptData } from "./mapToAttemptData";

import { getLessonData } from "@/app/classroom/pupil/programmes/[programmeSlug]/[unitSlug]/[lessonSlug]/results/printable/getLessonData";
import GoogleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import { PupilViewsResults } from "@/components/PupilViews/PupilResults/PupilResults.view";
import { LessonAttemptCamelCase } from "@/node-lib/pupil-api/types";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

type CourseWorkResultsPageData = {
  browseData: LessonBrowseData;
  content: LessonContent;
  attemptData: LessonAttemptCamelCase;
};

async function getCourseWorkResultsPageData(
  assignmentToken: string,
  submissionId: string,
): Promise<CourseWorkResultsPageData> {
  const data = await GoogleClassroomApi.getCourseWorkResults(
    assignmentToken,
    submissionId,
  );

  if (!data) {
    throw new Error("Failed to fetch results");
  }

  if (!data.pupilProgress) {
    throw new Error("No results found for this submission");
  }

  const lessonData = await getLessonData(data.lessonSlug);
  if (!lessonData) {
    throw new Error("Lesson data not found");
  }

  return {
    browseData: lessonData.browseData,
    content: lessonData.content,
    attemptData: mapToAttemptData(
      data.pupilProgress,
      lessonData.browseData.lessonData.title,
      data.lessonSlug,
      lessonData.browseData.programmeFields.subject,
      lessonData.browseData.programmeFields.yearDescription ?? "",
    ),
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
    const assignmentToken = searchParams?.get("assignmentToken");
    const submissionId = searchParams?.get("submissionId");

    if (!assignmentToken || !submissionId) {
      setError("Missing assignmentToken or submissionId");
      setLoading(false);
      return;
    }

    void getCourseWorkResultsPageData(assignmentToken, submissionId)
      .then(({ browseData, content, attemptData }) => {
        setBrowseData(browseData);
        setContent(content);
        setAttemptData(attemptData);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load results");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  if (loading || error || !browseData || !content || !attemptData) {
    return (
      <OakFlex $justifyContent="center" $alignItems="center" $minHeight="100vh">
        {loading ? (
          <OakLoadingSpinner $width="spacing-100" $color="icon-brand" />
        ) : (
          <OakP>{error ?? "Unable to load results"}</OakP>
        )}
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
