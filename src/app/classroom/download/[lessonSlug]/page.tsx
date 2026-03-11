"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  OakFlex,
  OakBox,
  OakPrimaryButton,
  OakHeading,
  OakP,
  OakLoadingSpinner,
} from "@oaknational/oak-components";

import { createLessonDownloadLink } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createDownloadLink";
import {
  createLink,
  hideAndClickDownloadLink,
} from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

type DownloadState = "loading" | "success" | "error";

function DownloadContent() {
  const params = useParams<{ lessonSlug: string }>();
  const searchParams = useSearchParams();

  const lessonSlug = params?.lessonSlug ?? "";
  const selection = searchParams?.get("selection") ?? "";
  const additionalFiles = searchParams?.get("additionalFiles") ?? undefined;

  const [downloadState, setDownloadState] = useState<DownloadState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDownload = useCallback(async () => {
    setDownloadState("loading");
    setErrorMessage(null);

    try {
      const downloadUrl = await createLessonDownloadLink({
        lessonSlug,
        selection,
        additionalFilesIdsSelection: additionalFiles,
        isLegacyDownload: false,
      });

      if (downloadUrl) {
        const link = createLink();
        hideAndClickDownloadLink(downloadUrl, link);
        setDownloadState("success");
        setTimeout(() => {
          window.close();
        }, 2000);
      } else {
        setDownloadState("error");
        setErrorMessage("Could not generate download link. Please try again.");
      }
    } catch {
      setDownloadState("error");
      setErrorMessage(
        "There was an error preparing your download. Please try again.",
      );
    }
  }, [lessonSlug, selection, additionalFiles]);

  useEffect(() => {
    if (lessonSlug && selection) {
      handleDownload();
    }
  }, [lessonSlug, selection, handleDownload]);

  if (!lessonSlug || !selection) {
    return (
      <OakFlex $justifyContent="center" $alignItems="center" $minHeight="100vh">
        <OakBox $pa="spacing-32" $textAlign="center">
          <OakHeading tag="h1" $font="heading-5">
            Invalid download link
          </OakHeading>
          <OakP $mt="spacing-16">
            This download link is missing required information.
          </OakP>
        </OakBox>
      </OakFlex>
    );
  }

  return (
    <OakFlex
      $justifyContent="center"
      $alignItems="center"
      $minHeight="100vh"
      $flexDirection="column"
      $gap="spacing-24"
    >
      <OakFlex
        $pa="spacing-32"
        $flexDirection="column"
        $alignItems="center"
        $gap="spacing-24"
      >
        <OakHeading tag="h1" $font="heading-5">
          Download lesson resources
        </OakHeading>

        {downloadState === "loading" && (
          <OakFlex
            $justifyContent="center"
            $alignItems="center"
            $gap="spacing-16"
            $flexDirection="column"
          >
            <OakLoadingSpinner $width="spacing-64" $color="icon-brand" />
            <OakP>Preparing your download...</OakP>
          </OakFlex>
        )}

        {downloadState === "success" && (
          <>
            <OakP $textAlign="center">Your download has started.</OakP>
            <OakP $textAlign="center">
              This tab will close automatically once download is complete.
            </OakP>
          </>
        )}

        {downloadState === "error" && (
          <>
            <OakP $textAlign="center">{errorMessage}</OakP>
            <OakPrimaryButton onClick={handleDownload} iconName="download">
              Try again
            </OakPrimaryButton>
          </>
        )}
      </OakFlex>
    </OakFlex>
  );
}

export default function ClassroomDownloadPage() {
  return (
    <Suspense
      fallback={
        <OakFlex
          $justifyContent="center"
          $alignItems="center"
          $minHeight="100vh"
        >
          <OakLoadingSpinner $width="spacing-100" $color="icon-brand" />
        </OakFlex>
      }
    >
      <DownloadContent />
    </Suspense>
  );
}
