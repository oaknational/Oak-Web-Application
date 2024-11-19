import { useEffect, useRef } from "react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { getUpdatedUrl } from "./getUpdatedUrl";
import { getShareIdFromCookie, getShareIdKey } from "./createShareId";

export const useShareExperiment = ({
  lessonSlug,
  unitSlug,
  programmeSlug,
}: {
  lessonSlug?: string;
  unitSlug?: string;
  programmeSlug?: string;
}) => {
  const shareIdRef = useRef<string | null>(null);
  const shareIdKeyRef = useRef<string | null>(null);

  const shareExperimentFlag = useFeatureFlagVariantKey(
    "delivery-sq-share-experiment",
  );

  useEffect(() => {
    if (!shareIdRef.current && shareExperimentFlag) {
      const key = [lessonSlug, unitSlug, programmeSlug]
        .filter(Boolean)
        .join("_");

      // get the current url params
      const urlParams = new URLSearchParams(window.location.search);
      const urlShareId = urlParams.get(getShareIdKey(key));
      const cookieShareId = getShareIdFromCookie(key);

      if (urlShareId && cookieShareId !== urlShareId) {
        // const urlShareMethod = urlParams.get("sm");
        // TODO: send a tracking event to the backend to track the share-id
      }

      const { url, shareIdKey, shareId } = getUpdatedUrl({
        url: window.location.href,
        cookieShareId,
        unhashedKey: key,
      });

      shareIdRef.current = shareId;
      shareIdKeyRef.current = shareIdKey;

      if (window.location.href !== url) {
        window.history.replaceState({}, "", url);
      }
    }
  }, [lessonSlug, programmeSlug, unitSlug, shareExperimentFlag]);

  return { shareIdRef, shareIdKeyRef };
};
