"use client";

import { PupilLessonProgress } from "@oaknational/google-classroom-addon/types";
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  OakBox,
  OakFlex,
  OakLoadingSpinner,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { getLessonData } from "./getLessonData";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import { PupilViewsResults } from "@/components/PupilViews/PupilResults";
import { MathJaxProvider } from "@/browser-lib/mathjax/MathJaxProvider";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { LessonAttemptCamelCase } from "@/node-lib/pupil-api/types";
import { PupilLessonProgressMapper } from "@/browser-lib/google-classroom/PupilLessonProgressMapper";

type Params = {
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
};
function GoogleClassroomPupilResultsPage() {
  const searchParams = useSearchParams();
  const params = useParams<Params>();
  const { lessonSlug } = params ?? {};
  const [browseData, setBrowseData] = React.useState<
    LessonBrowseData | undefined
  >();
  const [content, setContent] = React.useState<LessonContent | undefined>();
  const [progress, setProgress] = React.useState<
    LessonAttemptCamelCase | undefined
  >();
  const [loadingResults, setLoadingResults] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const getPupilResults = async (): Promise<PupilLessonProgress | null> => {
    const submissionId = searchParams?.get("submissionId");
    const itemId = searchParams?.get("itemId");
    const attachmentId = searchParams?.get("attachmentId");
    if (!submissionId || !itemId || !attachmentId) {
      throw new Error("Missing required query parameters");
    }
    const pupilProgress = await googleClassroomApi.getPupilLessonProgress({
      submissionId,
      itemId,
      attachmentId,
    });
    if (pupilProgress?.submissionId) return pupilProgress;
    return null;
  };

  const load = async () => {
    try {
      setLoadingResults(true);
      const [lessonData, pupilProgress] = await Promise.all([
        getLessonData(lessonSlug),
        getPupilResults(),
      ]);
      // add nice error handling for missing pupil progress data
      if (!pupilProgress) {
        throw new Error("No pupil progress data found for this lesson");
      }
      setBrowseData(lessonData?.browseData);
      setContent(lessonData?.content);
      setProgress(
        PupilLessonProgressMapper.toLessonAttemptData({
          pupilProgress,
          lessonTitle: lessonData?.browseData.lessonData.title ?? "",
          lessonSlug: lessonSlug ?? "",
          subject: lessonData?.browseData.programmeFields.subject ?? "",
          yearDescription:
            lessonData?.browseData.programmeFields.yearDescription ?? "",
        }),
      );
      setLoadingResults(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load results");
      setLoadingResults(false);
    }
  };

  const showResults =
    !loadingResults && !!browseData && !!content && !!progress;

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loadingResults) {
    return (
      <OakFlex $justifyContent={"center"} $alignItems={"center"}>
        <OakLoadingSpinner $width={"spacing-100"} $color={"icon-brand"} />
      </OakFlex>
    );
  }
  // redirect to an error page
  if (!showResults) {
    return (
      <OakFlex $justifyContent={"center"} $alignItems={"center"}>
        <p>{error ?? "Unable to load results"}</p>
      </OakFlex>
    );
  }

  return (
    <OakBox $background={"bg-primary"} $width={"100%"} $minHeight={"100vh"}>
      <OakMaxWidth
        $pv={"spacing-80"}
        $ph={"spacing-12"}
        $mv={"spacing-12"}
        $maxWidth={"spacing-1280"}
        $mh={"auto"}
      >
        <MathJaxProvider>
          <PupilViewsResults
            browseData={browseData}
            attemptData={progress}
            starterQuizQuestionsArray={content.starterQuiz}
            exitQuizQuestionsArray={content.exitQuiz}
          />
        </MathJaxProvider>
      </OakMaxWidth>
    </OakBox>
  );
}

export default GoogleClassroomPupilResultsPage;
