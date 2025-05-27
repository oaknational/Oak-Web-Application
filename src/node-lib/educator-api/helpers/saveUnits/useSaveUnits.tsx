import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";

import { useGetEducatorData } from "../useGetEducatorData";

import {
  TrackingProgrammeData,
  SavedToastProps,
  ErrorToastProps,
  UnsavedToastProps,
} from "./utils";

import { useOakToastContext } from "@/context/OakToast/useOakToastContext";
import { postEducatorData } from "@/node-lib/educator-api/helpers/postEducatorData";
import useAnalytics from "@/context/Analytics/useAnalytics";
import errorReporter from "@/common-lib/error-reporter";
import useSaveCountContext from "@/context/SaveCount/useSaveCountContext";

const unitsResponseSchema = z.array(z.string());
const reportError = errorReporter("educatorApi");

export const useSaveUnits = (
  programmeSlug: string,
  trackingData: TrackingProgrammeData,
) => {
  const { isSignedIn, user } = useUser();
  const { track } = useAnalytics();
  const { data: savedUnitsData } = useGetEducatorData<string[]>(
    `/api/educator-api/getSavedUnits/${programmeSlug}`,
  );

  const { incrementSavedUnitsCount, decrementSavedUnitsCount } =
    useSaveCountContext();

  const [locallySavedUnits, setLocallySavedUnits] = useState<Array<string>>([]);
  const [showSignIn, setShowSignIn] = useState<boolean>(false);

  useEffect(() => {
    if (savedUnitsData) {
      const parsedData = unitsResponseSchema.safeParse(savedUnitsData);
      if (parsedData.success) {
        if (parsedData.data.length > 0) {
          const savedUnitsString = parsedData.data.toSorted().toString();

          const locallySavedUnitsString = locallySavedUnits
            .toSorted()
            .toString();
          if (savedUnitsString !== locallySavedUnitsString) {
            setLocallySavedUnits(parsedData.data);
          }
        }
      } else {
        reportError(parsedData.error, { savedUnitsData });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedUnitsData]);

  const isOnboarded = user?.publicMetadata?.owa?.isOnboarded;

  const isUnitSaved = useCallback(
    (unitSlug: string) => locallySavedUnits.includes(unitSlug),
    [locallySavedUnits],
  );

  const { setCurrentToastProps } = useOakToastContext();

  const onSave = async (unitSlug: string) => {
    setLocallySavedUnits((prev) => [...prev, unitSlug]);
    setCurrentToastProps(SavedToastProps);
    incrementSavedUnitsCount();
    await postEducatorData(
      `/api/educator-api/saveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setLocallySavedUnits((prev) =>
          prev.filter((unit) => unit !== unitSlug),
        );
        setCurrentToastProps(ErrorToastProps);
        decrementSavedUnitsCount();
      },
    );
    track.contentSaved({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "use",
      componentType: trackingData.savedFrom,
      analyticsUseCase: "Teacher",
      keyStageSlug: trackingData.keyStageSlug ?? "specialist",
      keyStageTitle: trackingData.keyStageTitle ?? "Specialist",
      subjectSlug: trackingData.subjectSlug,
      subjectTitle: trackingData.subjectTitle,
      contentType: "unit",
      contentItemSlug: unitSlug,
      eventVersion: "2.0.0",
    });
  };

  const onUnsave = async (unitSlug: string) => {
    setLocallySavedUnits((prev) => prev.filter((unit) => unit !== unitSlug));
    setCurrentToastProps(UnsavedToastProps);
    decrementSavedUnitsCount();
    await postEducatorData(
      `/api/educator-api/unsaveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setLocallySavedUnits((prev) => [...prev, unitSlug]);
        setCurrentToastProps(ErrorToastProps);
        incrementSavedUnitsCount();
      },
    );
    track.contentUnsaved({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "use",
      componentType: trackingData.savedFrom,
      analyticsUseCase: "Teacher",
      keyStageSlug: trackingData.keyStageSlug ?? "specialist",
      keyStageTitle: trackingData.keyStageTitle ?? "Specialist",
      subjectSlug: trackingData.subjectSlug,
      subjectTitle: trackingData.subjectTitle,
      contentType: "unit",
      contentItemSlug: unitSlug,
      eventVersion: "2.0.0",
    });
  };

  const onSaveToggle = (unitSlug: string) => {
    if (isSignedIn && isOnboarded) {
      if (isUnitSaved(unitSlug)) {
        onUnsave(unitSlug);
      } else {
        onSave(unitSlug);
      }
    } else {
      setShowSignIn(true);
    }
  };

  return {
    isUnitSaved,
    onSaveToggle,
    showSignIn,
    setShowSignIn,
  };
};
