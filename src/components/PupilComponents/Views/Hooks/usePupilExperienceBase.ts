import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { LessonSection } from "@/components/PupilComponents/lessonSections";
import { getNewLessonSectionHref } from "@/components/PupilComponents/Views/ViewHelpers";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";

export const usePupilExperienceBase = () => {
  const router = useRouter();
  const isReadOnly = usePupilLessonProgress((state) => state.isReadOnly);

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

  const ensureCanProgress = useCallback(() => {
    if (isReadOnly) {
      goToSection("review");
      return false;
    }

    // destination hydration refreshes submission state asynchronously
    return true;
  }, [goToSection, isReadOnly]);

  return {
    router,
    currentSearchParams,
    getSectionHref,
    goToSection,
    ensureCanProgress,
  };
};
