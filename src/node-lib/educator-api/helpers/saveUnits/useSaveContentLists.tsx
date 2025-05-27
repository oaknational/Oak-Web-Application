import { OakP } from "@oaknational/oak-components";
import { useState, useCallback, useEffect } from "react";
import { z } from "zod";

import { useGetEducatorData } from "../useGetEducatorData";

import { useOakToastContext } from "@/context/OakToast/useOakToastContext";
import { postEducatorData } from "@/node-lib/educator-api/helpers/postEducatorData";
import errorReporter from "@/common-lib/error-reporter";
import useSaveCountContext from "@/context/SaveCount/useSaveCountContext";

const SavedToastProps = {
  message: (
    <OakP>
      <b>Unit saved</b> to My library
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

// type TrackingProgrammeData = {
//   savedFrom: "lesson_listing_save_button" | "unit_listing_save_button";
//   keyStageTitle: KeyStageTitleValueType | undefined;
//   keyStageSlug: string | undefined;
//   subjectTitle: string;
//   subjectSlug: string;
// };

const userListContentResponse = z.record(
  z.string(),
  z.array(
    z.object({
      keystage: z.string(),
      savedAt: z.string(),
      subject: z.string(),
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
  //const { track } = useAnalytics();
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

  const onSave = async (unitSlug: string, programmeSlug: string) => {
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
    // track.contentSaved({
    //   platform: "owa",
    //   product: "teacher lesson resources",
    //   engagementIntent: "use",
    //   componentType: trackingData.savedFrom,
    //   analyticsUseCase: "Teacher",
    //   keyStageSlug: trackingData.keyStageSlug ?? "specialist",
    //   keyStageTitle: trackingData.keyStageTitle ?? "Specialist",
    //   subjectSlug: trackingData.subjectSlug,
    //   subjectTitle: trackingData.subjectTitle,
    //   contentType: "unit",
    //   contentItemSlug: unitSlug,
    //   eventVersion: "2.0.0",
    // });
  };

  const onUnsave = async (unitSlug: string, programmeSlug: string) => {
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
    // track.contentUnsaved({
    //   platform: "owa",
    //   product: "teacher lesson resources",
    //   engagementIntent: "use",
    //   componentType: trackingData.savedFrom,
    //   analyticsUseCase: "Teacher",
    //   keyStageSlug: trackingData.keyStageSlug ?? "specialist",
    //   keyStageTitle: trackingData.keyStageTitle ?? "Specialist",
    //   subjectSlug: trackingData.subjectSlug,
    //   subjectTitle: trackingData.subjectTitle,
    //   contentType: "unit",
    //   contentItemSlug: unitSlug,
    //   eventVersion: "2.0.0",
    // });
  };

  const onSaveToggle = (unitSlug: string, programmeSlug: string) => {
    if (isUnitSaved(unitSlug, programmeSlug)) {
      onUnsave(unitSlug, programmeSlug);
    } else {
      onSave(unitSlug, programmeSlug);
    }
  };

  return {
    isUnitSaved,
    onSaveToggle,
    isLoading,
  };
};
