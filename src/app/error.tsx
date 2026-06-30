"use client";

import {
  OakMaxWidth,
  OakFlex,
  OakHeading,
  OakP,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import errorReporter from "@/common-lib/error-reporter";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import TopNavMinimal from "@/components/AppComponents/TopNav/TopNavMinimal";

export default function CoreError({
  error,
}: {
  readonly error: Error & { readonly digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    errorReporter("app::error-boundary")(error);
  }, [error]);

  return (
    <>
      <TopNavMinimal />
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
          <OakTertiaryButton
            onClick={() => router.back()}
            iconName="arrow-left"
          >
            Go back
          </OakTertiaryButton>
        </OakFlex>
      </OakMaxWidth>
      <LayoutSiteFooter />
    </>
  );
}
