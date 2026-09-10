import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { LessonSection } from "@/components/PupilComponents/lessonSections";
import { getNewLessonSectionHref } from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";

export const usePupilExperienceBase = () => {
  const router = useRouter();
  const isReadOnly = usePupilLessonProgress((state) => state.isReadOnly);
  const refreshReadOnlyFromStore = usePupilLessonProgress(
    (state) => state.refreshReadOnly,
  );
  const setReadOnlyFromStore = usePupilLessonProgress(
    (state) => state.setReadOnly,
  );

  const currentSearchParams = useMemo(
    () => new URLSearchParams(router.asPath.split("?")[1]),
    [router.asPath],
  );

  const getSectionHref = useCallback(
    (section: LessonSection) =>
      getNewLessonSectionHref({
        currentRoute: router.asPath,
        section,
        searchParams: currentSearchParams,
      }),
    [router.asPath, currentSearchParams],
  );

  const goToSection = useCallback(
    (section: LessonSection) => {
      void router.push(getSectionHref(section));
    },
    [router, getSectionHref],
  );

  useEffect(() => {
    const path = router.asPath.split("?")[0];
    if (!isReadOnly || path?.endsWith("/review")) return;
    goToSection("review");
  }, [goToSection, isReadOnly, router.asPath]);

  const ensureCanProgress = useCallback(async () => {
    if (isReadOnly) {
      goToSection("review");
      return false;
    }

    const nextIsReadOnly = refreshReadOnlyFromStore
      ? await refreshReadOnlyFromStore()
      : false;
    if (setReadOnlyFromStore) setReadOnlyFromStore(nextIsReadOnly);

    if (nextIsReadOnly) {
      goToSection("review");
      return false;
    }

    return true;
  }, [goToSection, isReadOnly, refreshReadOnlyFromStore, setReadOnlyFromStore]);

  return {
    router,
    currentSearchParams,
    getSectionHref,
    goToSection,
    ensureCanProgress,
  };
};
