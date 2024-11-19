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

type CurriculumTrackingProps = {
  lessonName: string;
  unitName: string;
  subjectSlug: string;
  subjectTitle: string | null;
  keyStageSlug: string;
  keyStageTitle: KeyStageTitleValueType;
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
    if (!shareIdRef.current && shareExperimentFlag) {
      const key = [lessonSlug, unitSlug, programmeSlug]
        .filter(Boolean)
        .join("_");

      // get the current url params
      const urlParams = new URLSearchParams(window.location.search);
      const urlShareId = urlParams.get(getShareIdKey(key));
      const cookieShareId = getShareIdFromCookie(key);

      const coreTrackingProps: CoreProperties = {
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "advocate",
        componentType: "page view",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
      };

      if (urlShareId && cookieShareId !== urlShareId) {
        // track the share converted event
        track.teacherShareConverted({
          shareId: urlShareId,
          linkUrl: window.location.href,
          lessonSlug,
          unitSlug,
          ...coreTrackingProps,
          ...curriculumTrackingProps,
        });
      }

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
