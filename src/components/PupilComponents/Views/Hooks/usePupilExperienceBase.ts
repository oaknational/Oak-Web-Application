import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import { LessonSection } from "@/components/PupilComponents/lessonSections";
import { getNewLessonSectionHref } from "@/components/PupilComponents/Views/ViewHelpers";

/**
 * Shared wiring for the per-section pupil experience hooks.
 *
 * Provides the route-agnostic navigation primitives every section needs:
 * the current search params (minus `section`) and helpers to build / navigate
 * to another section's href on the current route. Section-specific state,
 * analytics and handlers live in the individual `use<Section>Experience` hooks.
 */
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
