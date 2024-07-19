import {
  oakDefaultTheme,
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakSpan,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { useState } from "react";

import useAnalytics from "@/context/Analytics/useAnalytics";

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

    // record success event
    track.videoPlayed({
      videoTitle: String(variantKey),
      videoPlaybackId: "pupil-client-action-demo",
      durationSeconds: 10,
      isCaptioned: false,
      isMuted: false,
      timeElapsedSeconds: 0,
      videoLocation: null,
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
