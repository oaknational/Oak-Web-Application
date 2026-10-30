import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  OakFlex,
  OakHeading,
  OakMaxWidth,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { PupilLayout } from "@/components/PupilComponents/PupilLayout/PupilLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import errorReporter from "@/common-lib/error-reporter";

const reportError = errorReporter("pupil-lesson-overview");

type PupilLessonDataErrorProps = {
  missingBrowseData: boolean;
  missingLessonContent: boolean;
};

export const PupilLessonDataError = ({
  missingBrowseData,
  missingLessonContent,
}: PupilLessonDataErrorProps) => {
  const router = useRouter();
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) {
      return;
    }
    reported.current = true;
    reportError(new Error("Pupil lesson overview data is missing"), {
      pathname: router.pathname,
      isFallback: router.isFallback,
      missingBrowseData,
      missingLessonContent,
    });
  }, [
    router.pathname,
    router.isFallback,
    missingBrowseData,
    missingLessonContent,
  ]);

  return (
    <PupilLayout
      seoProps={{
        ...getSeoProps({ title: "We couldn't load this lesson" }),
        noIndex: true,
      }}
    >
      <main>
        <OakMaxWidth>
          <OakFlex
            $flexDirection="column"
            $alignItems="flex-start"
            $gap="spacing-24"
            $ph="spacing-24"
            $pv="spacing-48"
          >
            <OakHeading tag="h1" $font={["heading-5", "heading-4"]}>
              We couldn't load this lesson
            </OakHeading>
            <OakP>Reload the lesson to try again.</OakP>
            <OakPrimaryButton onClick={() => router.reload()}>
              Reload lesson
            </OakPrimaryButton>
          </OakFlex>
        </OakMaxWidth>
      </main>
    </PupilLayout>
  );
};
