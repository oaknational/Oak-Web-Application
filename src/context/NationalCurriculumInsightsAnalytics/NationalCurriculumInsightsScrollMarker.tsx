"use client";

import { useEffect, useRef } from "react";

import { useNationalCurriculumInsightsAnalytics } from "./useNationalCurriculumInsightsAnalytics";

export function NationalCurriculumInsightsScrollMarker() {
  const ref = useRef<HTMLDivElement>(null);
  const { trackScrolledTo } = useNationalCurriculumInsightsAnalytics();

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        trackScrolledTo("teacher-checklist");
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "-1px 0px 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trackScrolledTo]);

  return <div ref={ref} aria-hidden="true" style={{ height: 1 }} />;
}
