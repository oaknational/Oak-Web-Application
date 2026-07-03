"use client";

import {
  OakFlex,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

import errorReporter from "@/common-lib/error-reporter";

export default function ErrorFallback({
  error,
  reportError,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reportError: ReturnType<typeof errorReporter>;
  reset: () => void;
}>) {
  const router = useRouter();

  useEffect(() => {
    reportError(error);
  }, [error, reportError]);

  return (
    <OakMaxWidth $alignItems={"flex-end"}>
      <OakFlex
        $mv={"spacing-80"}
        $flexDirection={"column"}
        $width={["100%", "50%"]}
        $ph={"spacing-16"}
      >
        <OakFlex
          data-testid="errorStatus"
          $justifyContent={["flex-end", "flex-start"]}
        >
          <OakHeading $font={"heading-5"} $mb="spacing-12" tag="h1">
            An error occurred
          </OakHeading>
        </OakFlex>

        <OakHeading
          $mb="spacing-48"
          $font={["heading-5", "heading-4"]}
          tag={"h2"}
        >
          Whoops! It looks like you have fallen too far from the tree.
        </OakHeading>

        <OakP $mb="spacing-24">Let's get you back to browsing</OakP>
        <OakFlex $flexDirection="column" $gap="spacing-24">
          <OakTertiaryButton
            onClick={() =>
              startTransition(() => {
                reset();
                router.refresh();
              })
            }
            iconName="retake"
          >
            Retry
          </OakTertiaryButton>
          <OakTertiaryButton
            onClick={() => router.back()}
            iconName="arrow-left"
          >
            Go back
          </OakTertiaryButton>
        </OakFlex>
      </OakFlex>
    </OakMaxWidth>
  );
}
