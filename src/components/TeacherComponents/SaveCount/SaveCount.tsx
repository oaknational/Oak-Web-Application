import { OakSaveCount } from "@oaknational/oak-components";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { resolveOakHref } from "@/common-lib/urls";
import useSaveCountContext from "@/context/SaveCount/useSaveCountContext";
import { useGetEducatorData } from "@/node-lib/educator-api/helpers/useGetEducatorData";

export const SaveCount = () => {
  const { isSignedIn } = useUser();

  const {
    data: unitsCount,
    isLoading,
    mutate,
  } = useGetEducatorData<number>("/api/educator/getSavedUnitCount");

  const { savedUnitsCount, setSavedUnitsCount } = useSaveCountContext();

  useEffect(() => {
    if (unitsCount !== undefined) {
      setSavedUnitsCount(unitsCount);
    }
  }, [unitsCount, setSavedUnitsCount]);

  useEffect(() => {
    if (!isSignedIn) {
      setSavedUnitsCount(null);
    } else {
      mutate();
    }
  }, [isSignedIn, mutate, setSavedUnitsCount]);

  return (
    <OakSaveCount
      count={savedUnitsCount ?? undefined}
      href={resolveOakHref({ page: "my-library" })}
      loading={isLoading}
    />
  );
};
