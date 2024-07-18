import { OakFlex, OakHeading, OakSpan } from "@oaknational/oak-components";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

export type BetaABPageProps = {
  variant: string | boolean | undefined;
};

const getFeatureFlag = () =>
  new Promise<string | boolean | undefined>((resolve) => {
    posthog.onFeatureFlags(function () {
      // feature flags should be available at this point
      resolve(posthog.getFeatureFlag("pupil-ab-test"));
    });
  });

const BetaAb = () => {
  const [variant, setVariant] = useState<string | boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    getFeatureFlag().then((variant) => {
      setVariant(variant);
    });
  });

  console.log("variant", variant);

  if (variant === "variant-design") {
    // Do something differently for this user
    return (
      <OakFlex
        $background={"lemon"}
        $width={"100vw"}
        $height={"100vh"}
        $flexDirection={"column"}
        $alignItems={"center"}
        $justifyContent={"center"}
      >
        <OakHeading tag="h1">Pupil Beta AB experiment</OakHeading>
        <OakHeading tag="h2">Variant version</OakHeading>
        <OakSpan>Design variant - {variant}</OakSpan>
      </OakFlex>
    );
  } else {
    // It's a good idea to let control variant always be the default behaviour,
    // so if something goes wrong with flag evaluation, you don't break your app.
    return (
      <OakFlex
        $background={"mint"}
        $width={"100vw"}
        $height={"100vh"}
        $flexDirection={"column"}
        $alignItems={"center"}
        $justifyContent={"center"}
      >
        <OakHeading tag="h1">Pupil Beta AB experiment</OakHeading>
        <OakHeading tag="h2">Default version</OakHeading>
        <OakSpan>Design variant - {variant}</OakSpan>
      </OakFlex>
    );
  }
};

export default BetaAb;
