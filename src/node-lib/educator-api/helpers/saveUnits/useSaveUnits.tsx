import { OakP } from "@oaknational/oak-components";
import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { useGetEducatorData } from "../useGetEducatorData";

import { useOakToastContext } from "@/context/OakToast/useOakToastContext";
import { postEducatorData } from "@/node-lib/educator-api/helpers/postEducatorData";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";

const SavedToastProps = {
  message: (
    <OakP>
      <b>Unit saved</b> to My Library
    </OakP>
  ),
  variant: "green" as const,
  showIcon: true,
  autoDismiss: true,
};

const UnsavedToastProps = {
  message: (
    <OakP>
      <b>Unit removed</b> from My library
    </OakP>
  ),
  variant: "dark" as const,
  showIcon: false,
  autoDismiss: true,
};
const ErrorToastProps = {
  message: <OakP>Something went wrong</OakP>,
  variant: "error" as const,
  showIcon: false,
  autoDismiss: true,
};

type TrackingProgrammeData = {
  savedFrom: "lesson_listing_save_button" | "unit_listing_save_button";
  keyStageTitle: KeyStageTitleValueType | undefined;
  keyStageSlug: string | undefined;
  subjectTitle: string;
  subjectSlug: string;
};

export const useSaveUnits = (
  programmeSlug: string,
  trackingData: TrackingProgrammeData,
) => {
  const { isSignedIn } = useUser();
  const { track } = useAnalytics();
  const { data: savedUnitsData } = useGetEducatorData(
    `/api/educator-api/getSavedUnits/${programmeSlug}`,
  );

  const [locallySavedUnits, setLocallySavedUnits] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (savedUnitsData) {
      const savedUnitsSet = new Set<string>(savedUnitsData);
      if (savedUnitsSet.difference(locallySavedUnits).size > 0) {
        setLocallySavedUnits(savedUnitsSet);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedUnitsData]);

  const isUnitSaved = useCallback(
    (unitSlug: string) => locallySavedUnits.has(unitSlug),
    [locallySavedUnits],
  );

  const { setCurrentToastProps } = useOakToastContext();

  const onSave = async (unitSlug: string) => {
    setLocallySavedUnits((prev) => new Set(prev).add(unitSlug));
    setCurrentToastProps(SavedToastProps);
    await postEducatorData(
      `/api/educator-api/saveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setLocallySavedUnits((prev) => {
          const updatedUnits = new Set(prev);
          updatedUnits.delete(unitSlug);
          return updatedUnits;
        });
        setCurrentToastProps(ErrorToastProps);
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
    setLocallySavedUnits((prev) => {
      const updatedUnits = new Set(prev);
      updatedUnits.delete(unitSlug);
      return updatedUnits;
    });
    setCurrentToastProps(UnsavedToastProps);
    await postEducatorData(
      `/api/educator-api/unsaveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setLocallySavedUnits((prev) => new Set(prev).add(unitSlug));
        setCurrentToastProps(ErrorToastProps);
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
    if (isSignedIn) {
      if (isUnitSaved(unitSlug)) {
        onUnsave(unitSlug);
      } else {
        onSave(unitSlug);
      }
    } else {
      // TODO: show sign in modal
    }
  };

  return {
    isUnitSaved,
    onSaveToggle,
  };
};
