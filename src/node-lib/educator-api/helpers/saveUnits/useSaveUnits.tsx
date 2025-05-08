import { OakP } from "@oaknational/oak-components";
import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

import { useOakToastContext } from "@/context/OakToast/useOakToastContext";
import { postEducatorData } from "@/node-lib/educator-api/helpers/postEducatorData";

export const useSaveUnits = (
  savedUnits: Array<string>,
  programmeSlug: string,
) => {
  const [locallySavedUnits, setLocallySavedUnits] = useState<string[]>([]);
  const { isSignedIn } = useUser();

  const isUnitSaved = useCallback(
    (unitSlug: string) =>
      savedUnits?.includes(unitSlug) || locallySavedUnits.includes(unitSlug),
    [savedUnits, locallySavedUnits],
  );

  const { setCurrentToastProps } = useOakToastContext();

  const onSave = async (unitSlug: string) => {
    setLocallySavedUnits((prev) => [...prev, unitSlug]);
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
        setLocallySavedUnits((prev) => prev.filter((u) => u !== unitSlug));
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
        // TODO: unsaving
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
