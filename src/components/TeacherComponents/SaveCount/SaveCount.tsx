import { OakBox, OakSaveCount } from "@oaknational/oak-components";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import { resolveOakHref } from "@/common-lib/urls";
import useSaveCountContext from "@/context/SaveCount/useSaveCountContext";
import { useGetEducatorData } from "@/node-lib/educator-api/helpers/useGetEducatorData";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { ComponentType } from "@/browser-lib/avo/Avo";

export const SaveCount = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { signInStarted } = useTeacherBrowseAnalytics((store) => store.track);

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
    // OakSaveCount has no onClick, so catch the link click as it bubbles
    <OakBox
      $display="contents"
      onClick={() => {
        if (isLoaded && !isSignedIn) {
          signInStarted({
            componentType: ComponentType.TOPNAV_MY_LIBRARY_BUTTON,
          });
        }
      }}
    >
      <OakSaveCount
        count={savedUnitsCount ?? undefined}
        href={resolveOakHref({ page: "my-library" })}
        loading={isLoading}
      />
    </OakBox>
  );
};
