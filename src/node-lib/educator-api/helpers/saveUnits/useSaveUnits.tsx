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
  const [openSavingSignedOutModal, setOpenSavingSignedOutModal] =
    useState<boolean>(false);

  const { isSignedIn, user } = useUser();

  const isOnboarded = user?.publicMetadata?.owa?.isOnboarded;

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
        // Revert the optimistic update if the request fails and show an error toast
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
    if (isSignedIn && isOnboarded) {
      if (isUnitSaved(unitSlug)) {
        // TODO: unsaving
      } else {
        onSave(unitSlug);
      }
    } else {
      setOpenSavingSignedOutModal(true);
    }
  };

  return {
    isUnitSaved,
    onSaveToggle,
    openSavingSignedOutModal,
    setOpenSavingSignedOutModal,
  };
};
