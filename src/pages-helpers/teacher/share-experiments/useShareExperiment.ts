"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getUpdatedUrl } from "./getUpdatedUrl";
import {
  getActivationKey,
  getConversionShareId,
  getShareId,
  getShareIdKey,
  ShareSource,
  storeActivationKey,
  storeConversionShareId,
} from "./createShareId";
import {
  CoreProperties,
  CurriculumTrackingProps,
} from "./shareExperimentTypes";

import useAnalytics from "@/context/Analytics/useAnalytics";

export const useShareExperiment = ({
  programmeSlug,
  source,
  shareBaseUrl,
  curriculumTrackingProps,
  overrideExistingShareId,
}: {
  programmeSlug?: string;
  shareBaseUrl?: string;
  source: ShareSource;
  curriculumTrackingProps: CurriculumTrackingProps;
  overrideExistingShareId: boolean | null;
}) => {
  const shareIdRef = useRef<string | null>(null);
  const shareIdKeyRef = useRef<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null);

  const { track } = useAnalytics();

  const { lessonSlug, unitSlug } = curriculumTrackingProps;

  const coreTrackingProps: CoreProperties = useMemo(
    () => ({
      platform: "owa" as const,
      product: "teacher lesson resources" as const,
      engagementIntent: "advocate" as const,
      componentType: "page view" as const,
      eventVersion: "2.0.0" as const,
      analyticsUseCase: "Teacher" as const,
    }),
    [],
  );

  useEffect(() => {
    const key = [lessonSlug, unitSlug, programmeSlug].filter(Boolean).join("_");

    // get the current url params
    const urlParams = new URLSearchParams(window.location.search);
    const hashedKey = getShareIdKey(key);
    const urlShareId = urlParams.get(hashedKey);
    const storageShareId = getShareId(key);

    if (urlShareId && storageShareId !== urlShareId) {
      // check for existing conversion shareId
      if (!getConversionShareId(urlShareId)) {
        // store the converted shareId in a storage for preventing multiple conversion events
        storeConversionShareId(urlShareId);

        // track the share converted event irrespective of whether the user is part of the experiment
        track.teacherShareConverted({
          shareId: urlShareId,
          linkUrl: window.location.href,
          ...coreTrackingProps,
          ...curriculumTrackingProps,
        });
      }
    }

    // don't continue if feature flag is not yet ready
    if (overrideExistingShareId === null) {
      return;
    }

    // don't continue if we already have a shareId
    if (shareIdRef.current) {
      return;
    }

    if (overrideExistingShareId || !urlShareId) {
      // we update the url and send the share initiated event for any users in the experiment
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
        storageShareId: shareId,
        unhashedKey: key,
        source,
        shareMethod: "button",
      });

      setShareUrl(buttonUrl);

      if (!storageShareId) {
        // track the share initiated event
        track.teacherShareInitiated({
          shareId,
          sourcePageSlug: window.location.pathname,
          ...coreTrackingProps,
          ...curriculumTrackingProps,
        });
      }

      shareIdRef.current = shareId;
      shareIdKeyRef.current = shareIdKey;
    } else {
      const { url: buttonUrl } = getUpdatedUrl({
        url: shareBaseUrl || window.location.href,
        storageShareId: urlShareId,
        unhashedKey: key,
        source,
        shareMethod: "button",
      });

      setShareUrl(buttonUrl);

      shareIdRef.current = urlShareId;
      shareIdKeyRef.current = hashedKey;
    }
  }, [
    lessonSlug,
    programmeSlug,
    unitSlug,
    shareBaseUrl,
    curriculumTrackingProps,
    source,
    track,
    coreTrackingProps,
    overrideExistingShareId,
  ]);

  // Update browser URL when it changes
  useEffect(() => {
    if (!browserUrl) return;
    window.history.replaceState({}, "", browserUrl);
  }, [browserUrl]);

  const shareActivated = (noteLengthChars?: number) => {
    if (!shareIdRef.current || !shareIdKeyRef.current) {
      return;
    }

    if (!getActivationKey(shareIdKeyRef.current)) {
      track.teacherShareActivated({
        shareId: shareIdRef.current,
        linkUrl: window.location.href,
        sourcePageSlug: window.location.pathname,
        ...coreTrackingProps,
        ...curriculumTrackingProps,
        noteLengthChars,
      });

      storeActivationKey(shareIdKeyRef.current);
    }
  };

  return {
    shareIdRef,
    shareIdKeyRef,
    shareUrl,
    browserUrl,
    shareActivated,
  };
};
