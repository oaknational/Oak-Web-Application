import { useState, useCallback, useEffect } from "react";
import { z } from "zod";

import { useGetEducatorData } from "../useGetEducatorData";

import {
  SavedToastProps,
  ErrorToastProps,
  UnsavedToastProps,
  TrackingProgrammeData,
} from "./utils";

import { useOakToastContext } from "@/context/OakToast/useOakToastContext";
import { postEducatorData } from "@/node-lib/educator-api/helpers/postEducatorData";
import errorReporter from "@/common-lib/error-reporter";
import useSaveCountContext from "@/context/SaveCount/useSaveCountContext";
import useAnalytics from "@/context/Analytics/useAnalytics";

const userListContentResponse = z.record(
  z.string(),
  z.array(
    z.object({
      keystage: z.string(),
      savedAt: z.string(),
      subject: z.string(),
      tier: z.string().nullable(),
      examboard: z.string().nullable(),
      unitSlug: z.string(),
      unitTitle: z.string(),
      year: z.string(),
      lessons: z.array(
        z.object({
          slug: z.string(),
          title: z.string(),
          state: z.string(),
          order: z.number(),
        }),
      ),
    }),
  ),
);
type UserListContentResponse = z.infer<typeof userListContentResponse>;

const reportError = errorReporter("educatorApi");

export const useContentLists = () => {
  const { track } = useAnalytics();
  const { data: savedProgrammeUnits, isLoading } = useGetEducatorData<string[]>(
    `/api/educator-api/getSavedContentLists`,
  );

  const { incrementSavedUnitsCount, decrementSavedUnitsCount } =
    useSaveCountContext();

  const [locallySavedProgrammeUnits, setLocallySavedProgrammeUnits] =
    useState<UserListContentResponse>({});

  useEffect(() => {
    if (savedProgrammeUnits) {
      const parsedData = userListContentResponse.safeParse(savedProgrammeUnits);
      if (parsedData.success) {
        setLocallySavedProgrammeUnits(parsedData.data);
      } else {
        reportError(parsedData.error, { savedProgrammeUnits });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedProgrammeUnits]);

  const isUnitSaved = useCallback(
    (unitSlug: string, programmeSlug: string) =>
      locallySavedProgrammeUnits[programmeSlug]?.some(
        (unit) => unit.unitSlug === unitSlug,
      ),
    [locallySavedProgrammeUnits],
  );

  const { setCurrentToastProps } = useOakToastContext();

  const onSave = async (
    unitSlug: string,
    programmeSlug: string,
    trackingData: TrackingProgrammeData,
  ) => {
    setCurrentToastProps(SavedToastProps);
    incrementSavedUnitsCount();
    await postEducatorData(
      `/api/educator-api/saveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setCurrentToastProps(ErrorToastProps);
        decrementSavedUnitsCount();
      },
    );
    track.contentSaved({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "use",
      componentType: "unit_listing_save_button",
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

  const onUnsave = async (
    unitSlug: string,
    programmeSlug: string,
    trackingData: TrackingProgrammeData,
  ) => {
    setCurrentToastProps(UnsavedToastProps);
    decrementSavedUnitsCount();
    await postEducatorData(
      `/api/educator-api/unsaveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
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

  const onSaveToggle = (
    unitSlug: string,
    programmeSlug: string,
    trackingData: TrackingProgrammeData,
  ) => {
    if (isUnitSaved(unitSlug, programmeSlug)) {
      onUnsave(unitSlug, programmeSlug, trackingData);
    } else {
      onSave(unitSlug, programmeSlug, trackingData);
    }
  };

  return {
    isUnitSaved,
    onSaveToggle,
    isLoading,
    savedProgrammeUnits: locallySavedProgrammeUnits,
  };
};
