import { useSyncExternalStore } from "react";
import { z } from "zod";

import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import { LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION } from "@/config/localStorageKeys";

const savedSelectionSchema = z.array(z.string()).nullable();
const selectionChangedEvent = "insights-download-selection-changed";
let inMemorySelection: string | null = null;
let storageWriteFailed = false;

// Only explicit choices are saved. Automatic choices follow the current page.
const readSelection = () => {
  if (storageWriteFailed) return inMemorySelection;
  try {
    return window.localStorage.getItem(
      LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
    );
  } catch {
    return inMemorySelection;
  }
};

const subscribe = (onChange: () => void) => {
  window.addEventListener(selectionChangedEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(selectionChangedEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
};

const saveSelection = (values: string[] | null) => {
  inMemorySelection = values === null ? null : JSON.stringify(values);
  try {
    if (inMemorySelection === null) {
      window.localStorage.removeItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION);
    } else {
      window.localStorage.setItem(
        LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
        inMemorySelection,
      );
    }
    storageWriteFailed = false;
  } catch {
    // Keep the picker usable when browser storage is blocked.
    storageWriteFailed = true;
  }
  window.dispatchEvent(new Event(selectionChangedEvent));
};

const parseSelection = (value: string | null) => {
  try {
    const result = savedSelectionSchema.safeParse(JSON.parse(value ?? "null"));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

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
  const storedSelection = useSyncExternalStore(
    subscribe,
    readSelection,
    () => null,
  );
  const manualSelection = parseSelection(storedSelection);
  const available = new Set(availableDownloads(data.subjects));
  const selectedValues =
    manualSelection === null
      ? getPageDownloadSelection(data)
      : [...new Set(manualSelection)].filter((value) => available.has(value));

  const changeSelection = (values: string[]) => {
    const next = [...new Set(values)].filter((value) => available.has(value));
    // The picker calls this only for an explicit selection action. Choosing
    // Unselect all must stay manual even when the automatic selection is empty.
    saveSelection(next);
  };

  const resetSelection = () => {
    saveSelection(null);
  };

  return { selectedValues, changeSelection, resetSelection };
};
