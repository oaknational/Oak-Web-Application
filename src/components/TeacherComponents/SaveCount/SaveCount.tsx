import { OakSaveCount } from "@oaknational/oak-components";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { resolveOakHref } from "@/common-lib/urls";
import useSaveCountContext from "@/context/SaveCount/useSaveCountContext";
import { useGetEducatorData } from "@/node-lib/educator-api/helpers/useGetEducatorData";

export const SaveCount = () => {
  const isSaveEnabled = useFeatureFlagEnabled("teacher-save-units");
  const { isSignedIn } = useUser();

  const {
    data: unitsCount,
    isLoading,
    mutate,
  } = useGetEducatorData<number>("/api/educator-api/getSavedUnitCount");

  const { savedUnitsCount, setSavedUnitsCount, loading } =
    useSaveCountContext();

  useEffect(() => {
    if (unitsCount !== undefined) {
      setSavedUnitsCount(unitsCount);
    }
  }, [unitsCount, setSavedUnitsCount]);

  useEffect(() => {
    if (!isSignedIn) {
      setSavedUnitsCount(0);
    } else {
      mutate();
    }
  }, [isSignedIn, mutate, setSavedUnitsCount]);

  return isSaveEnabled ? (
    <OakSaveCount
      count={savedUnitsCount ?? 0}
      href={resolveOakHref({ page: "my-library" })}
      loading={isLoading || loading}
    />
  ) : null;
};
