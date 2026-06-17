import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { LessonSection } from "@/components/PupilComponents/lessonSections";
import { getNewLessonSectionHref } from "@/components/PupilComponents/Views/ViewHelpers";

export const usePupilExperienceBase = () => {
  const router = useRouter();

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

  return { router, currentSearchParams, getSectionHref, goToSection };
};
