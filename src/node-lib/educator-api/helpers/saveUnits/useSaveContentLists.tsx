import { useState, useCallback, useEffect } from "react";

import { useGetEducatorData } from "../useGetEducatorData";
import {
  userListContentApiResponse,
  UserlistContentApiResponse,
} from "../../queries/getUserListContent/getUserListContent.types";

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
import { CollectionData } from "@/components/TeacherViews/MyLibrary/MyLibrary";

const reportError = errorReporter("educatorApi");

export const useContentLists = () => {
  const { track } = useAnalytics();
  const { data: savedProgrammeUnits, isLoading } =
    useGetEducatorData<UserlistContentApiResponse>(
      `/api/educator-api/getSavedContentLists`,
    );

  const { incrementSavedUnitsCount, decrementSavedUnitsCount } =
    useSaveCountContext();

  const [collectionData, setCollectionData] = useState<CollectionData | null>(
    null,
  );

  useEffect(() => {
    if (savedProgrammeUnits) {
      const parsedData =
        userListContentApiResponse.safeParse(savedProgrammeUnits);
      if (parsedData.success) {
        const collectionData = Object.entries(parsedData.data)
          .map(([programmeSlug, programmeData]) => {
            const { keystage, subject, examboard, tier, units } = programmeData;
            const subheading = `${examboard ? examboard + " " : ""}${tier ? tier + " " : ""}${keystage}`;
            return {
              subject,
              subheading,
              examboard,
              tier,
              keystage,
              units,
              programmeSlug,
            };
          })
          .sort((a, b) => {
            if (!a || !b) return 0;
            return (
              a.subject.localeCompare(b.subject) ||
              a.subheading.localeCompare(b.subheading)
            );
          });

        setCollectionData(collectionData);
      } else {
        reportError(parsedData.error, { savedProgrammeUnits });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedProgrammeUnits]);

  const isUnitSaved = useCallback(
    (unitSlug: string, programmeSlug: string) =>
      collectionData?.some((collection) =>
        collection.units.some(
          (unit) =>
            unit.unitSlug === unitSlug &&
            collection.programmeSlug === programmeSlug,
        ),
      ),

    [collectionData],
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
    collectionData,
  };
};
