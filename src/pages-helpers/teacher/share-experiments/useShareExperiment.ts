import { useEffect, useRef } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { getUpdatedUrl } from "./getUpdatedUrl";
import {
  getShareIdFromCookie,
  getShareIdKey,
  shareSources,
} from "./createShareId";

import useAnalytics from "@/context/Analytics/useAnalytics";
import {
  KeyStageTitleValueType,
  TeacherShareInitiatedProperties,
} from "@/browser-lib/avo/Avo";

export type CurriculumTrackingProps = {
  lessonName: string | null;
  unitName: string | null;
  subjectSlug: string | null;
  subjectTitle: string | null;
  keyStageSlug: string | null;
  keyStageTitle: KeyStageTitleValueType | null;
};

type CoreProperties = Pick<
  TeacherShareInitiatedProperties,
  | "platform"
  | "product"
  | "engagementIntent"
  | "componentType"
  | "eventVersion"
  | "analyticsUseCase"
>;

export const useShareExperiment = ({
  lessonSlug,
  unitSlug,
  programmeSlug,
  source,
  curriculumTrackingProps,
}: {
  lessonSlug?: string;
  unitSlug?: string;
  programmeSlug?: string;
  source: keyof typeof shareSources;
  curriculumTrackingProps: CurriculumTrackingProps;
}) => {
  const shareIdRef = useRef<string | null>(null);
  const shareIdKeyRef = useRef<string | null>(null);

  const shareExperimentFlag = useFeatureFlagVariantKey(
    "delivery-sq-share-experiment",
  );

  const { track } = useAnalytics();

  useEffect(() => {
    const coreTrackingProps: CoreProperties = {
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "advocate",
      componentType: "page view",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
    };

    const key = [lessonSlug, unitSlug, programmeSlug].filter(Boolean).join("_");

    // get the current url params
    const urlParams = new URLSearchParams(window.location.search);
    const urlShareId = urlParams.get(getShareIdKey(key));
    const cookieShareId = getShareIdFromCookie(key);

    if (urlShareId && cookieShareId !== urlShareId) {
      // track the share converted event irrespective of whether the user is part of the experiment
      track.teacherShareConverted({
        shareId: urlShareId,
        linkUrl: window.location.href,
        lessonSlug,
        unitSlug,
        ...coreTrackingProps,
        ...curriculumTrackingProps,
      });
    }

    if (!shareIdRef.current && shareExperimentFlag) {
      const { url, shareIdKey, shareId } = getUpdatedUrl({
        url: window.location.href,
        cookieShareId,
        unhashedKey: key,
        source,
      });

      if (!cookieShareId) {
        // track the share activated event
        track.teacherShareInitiated({
          unitSlug,
          lessonSlug,
          shareId,
          sourcePageSlug: window.location.pathname,
          ...coreTrackingProps,
          ...curriculumTrackingProps,
        });
      }

      shareIdRef.current = shareId;
      shareIdKeyRef.current = shareIdKey;

      if (window.location.href !== url) {
        window.history.replaceState({}, "", url);
      }
    }
  }, [
    lessonSlug,
    programmeSlug,
    unitSlug,
    curriculumTrackingProps,
    shareExperimentFlag,
    source,
    track,
  ]);

  return { shareIdRef, shareIdKeyRef };
};
