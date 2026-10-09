import { useState } from "react";
import { z } from "zod";

import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { LS_KEY_INSIGHTS_DOWNLOAD_SELECTION } from "@/config/localStorageKeys";
import useLocalStorage from "@/hooks/useLocalStorage";

const savedSelectionSchema = z.array(z.string()).nullable();

const availableDownloads = (
  subjects: NationalCurriculumInsightsRouteData["subjects"],
) =>
  subjects.flatMap(({ slug, tabs }) =>
    tabs.map(({ kind }) => `${slug}:${kind}`),
  );

export const getPageDownloadSelection = ({
  route,
  subjects,
}: Pick<NationalCurriculumInsightsRouteData, "route" | "subjects">) => {
  if (route.kind === "hub" || route.kind === "guidance") return [];

  return availableDownloads(subjects).filter((value) =>
    route.kind === "subject"
      ? value.startsWith(`${route.subjectSlug}:`)
      : value === `${route.subjectSlug}:${route.phase}`,
  );
};

export const useDownloadSelection = (
  data: NationalCurriculumInsightsRouteData,
) => {
  const [savedSelection, setSavedSelection] = useLocalStorage<string[] | null>(
    LS_KEY_INSIGHTS_DOWNLOAD_SELECTION,
    null,
    undefined,
    savedSelectionSchema,
  );
  const [sessionSelection, setSessionSelection] = useState<
    string[] | null | undefined
  >();
  const manualSelection =
    sessionSelection === undefined ? savedSelection : sessionSelection;
  const available = new Set(availableDownloads(data.subjects));
  const selectedValues =
    manualSelection === null
      ? getPageDownloadSelection(data)
      : [...new Set(manualSelection)].filter((value) => available.has(value));

  const changeSelection = (values: string[]) => {
    const next = [...new Set(values)].filter((value) => available.has(value));
    if (
      next.length === selectedValues.length &&
      next.every((value) => selectedValues.includes(value))
    ) {
      return;
    }
    setSessionSelection(next);
    setSavedSelection(next);
  };

  const resetSelection = () => {
    setSessionSelection(null);
    setSavedSelection(null);
  };

  return { selectedValues, changeSelection, resetSelection };
};
