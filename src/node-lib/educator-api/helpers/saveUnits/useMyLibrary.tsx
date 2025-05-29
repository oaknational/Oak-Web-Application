import { useState, useCallback, useEffect } from "react";
import { kebabCase } from "lodash";

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
  getUnitProgrammeSlug,
} from "./utils";

import { useOakToastContext } from "@/context/OakToast/useOakToastContext";
import { postEducatorData } from "@/node-lib/educator-api/helpers/postEducatorData";
import errorReporter from "@/common-lib/error-reporter";
import useSaveCountContext from "@/context/SaveCount/useSaveCountContext";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { CollectionData } from "@/components/TeacherViews/MyLibrary/MyLibrary";

const reportError = errorReporter("educatorApi");

export const useMyLibrary = () => {
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
  const [locallySavedUnits, setLocallySavedUnits] = useState<Array<string>>([]);

  useEffect(() => {
    if (savedProgrammeUnits) {
      const parsedData =
        userListContentApiResponse.safeParse(savedProgrammeUnits);

      if (parsedData.success) {
        const collectionData = Object.entries(parsedData.data)
          .map(([programmeSlug, programmeData]) => {
            const {
              keystage,
              subject,
              examboard,
              tier,
              units,
              subjectSlug,
              keystageSlug,
              subjectCategories,
            } = programmeData;
            const subheading = `${examboard ? examboard + " " : ""}${tier ? tier + " " : ""}${keystage}`;
            const validSubjectCategory =
              subjectCategories &&
              subjectCategories[0] &&
              subjectCategories[0] !== subject
                ? subjectCategories[0]
                : null;
            const programmeTitle = `${subject}${validSubjectCategory ? `: ${validSubjectCategory}` : ""} ${subheading}`;
            const searchQuery = validSubjectCategory
              ? `${kebabCase(validSubjectCategory)}`
              : null;

            units.sort(
              (a, b) => a.yearOrder - b.yearOrder || a.unitOrder - b.unitOrder,
            );

            return {
              subject,
              subjectSlug,
              keystageSlug,
              subheading,
              keystage,
              units,
              programmeSlug,
              programmeTitle,
              searchQuery,
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

        // Create a flat list of unique saved unit slugs to be updated locally
        const savedUnitProgrammeSlugs = Object.entries(parsedData.data).flatMap(
          ([programmeSlug, programmeData]) =>
            programmeData.units.map((unit) =>
              getUnitProgrammeSlug(unit.unitSlug, programmeSlug),
            ),
        );
        setLocallySavedUnits(savedUnitProgrammeSlugs);
      } else {
        reportError(parsedData.error, { savedProgrammeUnits });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedProgrammeUnits]);

  const isUnitSaved = useCallback(
    (unitProgrammeSlug: string) =>
      locallySavedUnits.includes(unitProgrammeSlug),
    [locallySavedUnits],
  );

  const { setCurrentToastProps } = useOakToastContext();

  const onSave = async (
    unitSlug: string,
    programmeSlug: string,
    unitProgrammeSlug: string,
    trackingData: TrackingProgrammeData,
  ) => {
    setCurrentToastProps(SavedToastProps);
    incrementSavedUnitsCount();
    setLocallySavedUnits((prev) => [...prev, unitProgrammeSlug]);
    await postEducatorData(
      `/api/educator-api/saveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setCurrentToastProps(ErrorToastProps);
        setLocallySavedUnits((prev) =>
          prev.filter((slug) => slug !== unitProgrammeSlug),
        );
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
    unitProgrammeSlug: string,
    trackingData: TrackingProgrammeData,
  ) => {
    setCurrentToastProps(UnsavedToastProps);
    decrementSavedUnitsCount();
    setLocallySavedUnits((prev) =>
      prev.filter((slug) => slug !== unitProgrammeSlug),
    );
    await postEducatorData(
      `/api/educator-api/unsaveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setCurrentToastProps(ErrorToastProps);
        setLocallySavedUnits((prev) => [...prev, unitProgrammeSlug]);
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
    const unitProgrammeSlug = getUnitProgrammeSlug(unitSlug, programmeSlug);
    if (isUnitSaved(unitProgrammeSlug)) {
      onUnsave(unitSlug, programmeSlug, unitProgrammeSlug, trackingData);
    } else {
      onSave(unitSlug, programmeSlug, unitProgrammeSlug, trackingData);
    }
  };

  return {
    isUnitSaved,
    onSaveToggle,
    isLoading,
    collectionData,
  };
};
