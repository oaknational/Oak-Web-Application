import { OakP } from "@oaknational/oak-components";
import { useState, useCallback, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { useGetEducatorData } from "../useGetEducatorData";

import { useOakToastContext } from "@/context/OakToast/useOakToastContext";
import { postEducatorData } from "@/node-lib/educator-api/helpers/postEducatorData";

export const useSaveUnits = (programmeSlug: string) => {
  const { isSignedIn } = useUser();

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
  }, [savedUnitsData, locallySavedUnits]);

  const isUnitSaved = useCallback(
    (unitSlug: string) => locallySavedUnits.has(unitSlug),
    [locallySavedUnits],
  );

  const { setCurrentToastProps } = useOakToastContext();

  const onSave = async (unitSlug: string) => {
    setLocallySavedUnits((prev) => new Set(prev).add(unitSlug));
    setCurrentToastProps({
      message: (
        <OakP>
          <b>Unit saved</b> to My Library
        </OakP>
      ),
      variant: "green",
      showIcon: true,
      autoDismiss: true,
    });
    await postEducatorData(
      `/api/educator-api/saveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setLocallySavedUnits((prev) => {
          const updatedUnits = new Set(prev);
          updatedUnits.delete(unitSlug);
          return updatedUnits;
        });
        setCurrentToastProps({
          message: <OakP>Something went wrong</OakP>,
          variant: "error",
          showIcon: false,
          autoDismiss: true,
        });
      },
    );
  };

  const onUnsave = async (unitSlug: string) => {
    setLocallySavedUnits((prev) => {
      const updatedUnits = new Set(prev);
      updatedUnits.delete(unitSlug);
      return updatedUnits;
    });
    setCurrentToastProps({
      message: (
        <OakP>
          <b>Unit removed</b> from My library
        </OakP>
      ),
      variant: "dark",
      showIcon: false,
      autoDismiss: true,
    });
    await postEducatorData(
      `/api/educator-api/unsaveUnit/${programmeSlug}/${unitSlug}`,
      () => {
        // Revert the optimistic update if the request fails and show an error toast
        setLocallySavedUnits((prev) => new Set(prev).add(unitSlug));
        setCurrentToastProps({
          message: <OakP>Something went wrong</OakP>,
          variant: "error",
          showIcon: false,
          autoDismiss: true,
        });
      },
    );
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
