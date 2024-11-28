import { useEffect, useMemo, useRef, useState } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { getUpdatedUrl } from "./getUpdatedUrl";
import {
  getActivationKey,
  getConversionShareId,
  getShareId,
  getShareIdKey,
  shareSources,
  storeActivationKey,
  storeConversionShareId,
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
  shareBaseUrl,
  curriculumTrackingProps,
}: {
  lessonSlug?: string;
  unitSlug?: string;
  programmeSlug?: string;
  shareBaseUrl?: string;
  source: keyof typeof shareSources;
  curriculumTrackingProps: CurriculumTrackingProps;
}) => {
  const shareIdRef = useRef<string | null>(null);
  const shareIdKeyRef = useRef<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);

  const shareExperimentFlag = useFeatureFlagVariantKey(
    "delivery-sq-share-experiment",
  );

  const { track } = useAnalytics();

  const coreTrackingProps: CoreProperties = useMemo(
    () => ({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "advocate",
      componentType: "page view",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
    }),
    [],
  );

  useEffect(() => {
    const key = [lessonSlug, unitSlug, programmeSlug].filter(Boolean).join("_");

    // get the current url params
    const urlParams = new URLSearchParams(window.location.search);
    const urlShareId = urlParams.get(getShareIdKey(key));
    const storageShareId = getShareId(key);

    if (urlShareId && storageShareId !== urlShareId) {
      // check for  existing conversion shareId
      if (!getConversionShareId(urlShareId)) {
        // TODO: store the converted shareId in a storage for preventing multiple conversion events
        storeConversionShareId(urlShareId);

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
    }

    if (!shareIdRef.current && shareExperimentFlag) {
      const { url, shareIdKey, shareId } = getUpdatedUrl({
        url: window.location.href,
        storageShareId,
        unhashedKey: key,
        source,
        shareMethod: "url",
      });

      setBrowserUrl(url);

      const { url: buttonUrl } = getUpdatedUrl({
        url: shareBaseUrl || window.location.href,
        storageShareId: shareId, // we know that this will now be the shareId
        unhashedKey: key,
        source,
        shareMethod: "button",
      });

      setShareUrl(buttonUrl);

      if (!storageShareId) {
        // track the share initiated event
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
    }
  }, [
    lessonSlug,
    programmeSlug,
    unitSlug,
    shareBaseUrl,
    curriculumTrackingProps,
    shareExperimentFlag,
    source,
    track,
    coreTrackingProps,
  ]);

  const shareActivated = () => {
    if (!shareIdRef.current || !shareIdKeyRef.current) {
      return;
    }

    if (!getActivationKey(shareIdKeyRef.current)) {
      track.teacherShareActivated({
        shareId: shareIdRef.current,
        linkUrl: window.location.href,
        lessonSlug,
        unitSlug,
        sourcePageSlug: window.location.pathname,
        ...coreTrackingProps,
        ...curriculumTrackingProps,
      });

      storeActivationKey(shareIdKeyRef.current);
    }
  };

  return {
    shareExperimentFlag,
    shareIdRef,
    shareIdKeyRef,
    shareUrl,
    browserUrl,
    shareActivated,
  };
};
