import { useRouter } from "next/router";
import { useEffect, MouseEvent, useRef, useCallback } from "react";
import { resolveHref } from "next/dist/client/resolve-href";

import { LessonSection, isLessonSection } from "../LessonEngineProvider";

/**
 * Subscribes to popstate events and calls the provided callback with the current section
 */
export function useLessonPopStateHandler(
  callback: (section: LessonSection) => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    function popStateHandler(event: PopStateEvent) {
      const nextSection = event.state ?? "overview";

      if (nextSection && isLessonSection(nextSection)) {
        callbackRef.current(nextSection);
      }
    }

    window.addEventListener("popstate", popStateHandler);

    return () => window.removeEventListener("popstate", popStateHandler);
  }, []);
}

/**
 * Sets the current lesson section in the URL and history state
 */
export function useNavigateToSection() {
  const router = useRouter();
  const initialSection = router.query?.section?.toString();
  const activeSectionRef = useRef<LessonSection>(
    initialSection && isLessonSection(initialSection)
      ? initialSection
      : "overview",
  );
  const getHref = useLessonSectionHref();

  return useCallback(
    function navigateToSection(section: LessonSection) {
      if (router.isReady) {
        const method =
          activeSectionRef.current === section ? "replaceState" : "pushState";
        window.history[method](section, "", getHref(section));
        activeSectionRef.current = section;
      }
    },
    [getHref, router],
  );
}

/**
 * Returns props to create a link to a section with an onClick handler that allows internal routing
 * and state updates without a full page reload
 */
export function useGetSectionLinkProps() {
  const getHref = useLessonSectionHref();

  return useCallback(
    function getSectionLinkProps<T extends LessonSection>(
      section: T,
      callback: (section: T) => void,
    ) {
      const href = getHref(section);

      return {
        href,
        onClick(event: MouseEvent<HTMLAnchorElement>) {
          event.preventDefault();
          callback(section);
        },
      };
    },
    [getHref],
  );
}

function useLessonSectionHref() {
  const router = useRouter();

  return useCallback(
    function getHref(section: LessonSection) {
      const resolved = resolveHref(
        router,
        { pathname: router.pathname, query: { ...router.query, section } },
        true,
      );

      return resolved.at(1);
    },
    [router],
  );
}
