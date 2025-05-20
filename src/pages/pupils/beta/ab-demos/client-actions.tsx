import { useFeatureFlagVariantKey } from "posthog-js/react";
import { useState } from "react";
import {
  oakDefaultTheme,
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSpan,
  OakThemeProvider,
} from "@oaknational/oak-components";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { LessonReleaseCohortValueType } from "@/browser-lib/avo/Avo";

/**
 *
 * This page demonstrates how to configure AB testing with posthog using a client-side implementation.
 * For more information see https://www.notion.so/oaknationalacademy/Running-Posthog-AB-tests-6eb76901e0cc44dca1b30338720026da?pvs=4
 *
 */

const Page = () => {
  const { track } = useAnalytics();
  const variantKey = useFeatureFlagVariantKey("pupil-client-action-demo");
  const [isConcluded, setIsConcluded] = useState(false);

  const handleClick = () => {
    if (variantKey === "test") {
      for (let i = 0; i < 3; i++) {
        const b = confirm("Are you sure you wanted to click this button?");
        if (!b) {
          return;
        }
      }
    } else {
      const b = confirm("Are you sure you wanted to click this button?");
      if (!b) {
        return;
      }
    }
    const pathwayData = {
      lessonName: undefined,
      lessonSlug: undefined,
      subjectTitle: undefined,
      subjectSlug: undefined,
      unitName: undefined,
      unitSlug: undefined,
      keyStageTitle: undefined,
      keyStageSlug: undefined,
      yearGroupName: undefined,
      yearGroupSlug: undefined,
      tierName: undefined,
      examBoard: undefined,
      pathway: undefined,
      releaseGroup: undefined,
      phase: undefined,
      lessonReleaseDate: "2023-10-01",
      lessonReleaseCohort: "2020-2023" as LessonReleaseCohortValueType,
    };

    // record success event
    track.videoPlayed({
      videoTitle: String(variantKey),
      videoPlaybackId: ["pupil-client-action-demo"],
      durationSeconds: 10,
      isCaptioned: false,
      isMuted: false,
      timeElapsedSeconds: 0,
      videoLocation: null,
      ...pathwayData,
    });

    // display success message
    alert("You successfully converted!");
  };

  // Do something differently for this user
  return (
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex
        $background={"lemon"}
        $width={"100vw"}
        $height={"100vh"}
        $flexDirection={"column"}
        $alignItems={"center"}
        $justifyContent={"center"}
        $gap={"all-spacing-3"}
      >
        <OakHeading tag="h1">Pupil AB Demo</OakHeading>
        <OakHeading tag="h2">
          Client: Action changes according to variant
        </OakHeading>
        <OakSpan>Design variant - {variantKey}</OakSpan>
        {isConcluded && <OakSpan>Concluded</OakSpan>}
        {!isConcluded && (
          <OakPrimaryButton
            onClick={() => {
              handleClick();
              setIsConcluded(true);
            }}
          >
            Click me
          </OakPrimaryButton>
        )}
      </OakFlex>
    </OakThemeProvider>
  );
};

export default Page;
