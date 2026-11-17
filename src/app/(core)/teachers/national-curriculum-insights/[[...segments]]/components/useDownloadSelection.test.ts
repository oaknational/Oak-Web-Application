import { act, renderHook } from "@testing-library/react";

import { hubData } from "../__fixtures__/stories";
import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import {
  getPageDownloadSelection,
  useDownloadSelection,
} from "./useDownloadSelection";

import { LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION } from "@/config/localStorageKeys";

const subjects: NationalCurriculumInsightsRouteData["subjects"] = [
  {
    ...hubData.subjects[0]!,
    slug: "history",
    title: "History",
    tabs: [hubData.subjects[0]!.tabs[0]!, hubData.subjects[0]!.tabs[1]!],
  },
  {
    ...hubData.subjects[0]!,
    slug: "music",
    title: "Music",
    tabs: [hubData.subjects[0]!.tabs[0]!],
  },
  ...["maths", "drama", "geography"].map((slug) => ({
    ...hubData.subjects[0]!,
    slug,
    title: slug,
    tabs: [hubData.subjects[0]!.tabs[0]!],
  })),
];

const page = (route: NationalCurriculumInsightsRouteData["route"]) => ({
  ...hubData,
  route,
  subjects,
});

beforeEach(() => {
  window.sessionStorage.clear();
  window.localStorage.clear();
});

describe("page download defaults", () => {
  it("selects all available phases on a subject page", () => {
    expect(
      getPageDownloadSelection(
        page({ kind: "subject", subjectSlug: "history" }),
      ),
    ).toEqual(["history:primary", "history:secondary"]);
  });

  it.each(["subjectPhase", "subjectPhaseKeyStage"] as const)(
    "selects only the matching phase for %s",
    (kind) => {
      expect(
        getPageDownloadSelection(
          page({
            kind,
            subjectSlug: "history",
            phase: "secondary",
            keyStageSlug: "key-stage-3",
          }),
        ),
      ).toEqual(["history:secondary"]);
    },
  );

  it.each(["hub", "guidance"] as const)(
    "does not select a default for %s",
    (kind) => {
      expect(getPageDownloadSelection(page({ kind }))).toEqual([]);
    },
  );

  it("does not select a subject or phase missing from the catalogue", () => {
    expect(
      getPageDownloadSelection(
        page({ kind: "subject", subjectSlug: "unknown" }),
      ),
    ).toEqual([]);
    expect(
      getPageDownloadSelection(
        page({
          kind: "subjectPhase",
          subjectSlug: "music",
          phase: "secondary",
        }),
      ),
    ).toEqual([]);
  });
});

describe("saved download choices", () => {
  it.each([{ saved: ["music:primary", "maths:primary"] }, { saved: [] }])(
    "restores manual choices from an earlier session: $saved",
    ({ saved }) => {
      window.localStorage.setItem(
        LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
        JSON.stringify(saved),
      );
      const { result, rerender } = renderHook(useDownloadSelection, {
        initialProps: page({ kind: "subject", subjectSlug: "history" }),
      });
      expect(result.current.selectedValues).toEqual(saved);
      rerender(page({ kind: "subject", subjectSlug: "music" }));
      expect(result.current.selectedValues).toEqual(saved);
    },
  );

  it("keeps manual choices when a new tab session starts", () => {
    const first = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() => first.result.current.changeSelection(["maths:primary"]));
    first.unmount();
    window.sessionStorage.clear();
    const nextSession = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "history" }),
    });
    expect(nextSession.result.current.selectedValues).toEqual([
      "maths:primary",
    ]);
  });

  it("ignores legacy choices that do not distinguish automatic and manual selection", () => {
    window.localStorage.setItem(
      "oak-insights-download-selection",
      JSON.stringify(["maths:primary"]),
    );
    window.sessionStorage.setItem(
      "oak-insights-download-selection",
      JSON.stringify(["maths:primary"]),
    );
    const { result } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    expect(result.current.selectedValues).toEqual(["music:primary"]);
  });

  it("replaces automatic History choices with Music when the page changes", () => {
    const { result, rerender } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "history" }),
    });
    expect(result.current.selectedValues).toEqual([
      "history:primary",
      "history:secondary",
    ]);
    rerender(page({ kind: "subject", subjectSlug: "music" }));
    expect(result.current.selectedValues).toEqual(["music:primary"]);
    rerender(page({ kind: "hub" }));
    expect(result.current.selectedValues).toEqual([]);
    expect(
      window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION),
    ).toBeNull();
  });

  it("preserves manual choices without adding History on the next page", () => {
    const chosen = [
      "music:primary",
      "maths:primary",
      "drama:primary",
      "geography:primary",
    ];
    const { result, rerender } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() => result.current.changeSelection(chosen));
    rerender(page({ kind: "subject", subjectSlug: "history" }));
    expect(result.current.selectedValues).toEqual(chosen);
    expect(
      JSON.parse(
        window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION)!,
      ),
    ).toEqual(chosen);
  });

  it("restores manual choices on reload or remount", () => {
    const first = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() =>
      first.result.current.changeSelection(["music:primary", "maths:primary"]),
    );
    first.unmount();
    const later = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "history" }),
    });
    expect(later.result.current.selectedValues).toEqual([
      "music:primary",
      "maths:primary",
    ]);
  });

  it("preserves an intentionally empty selection after navigation and remounting", () => {
    const first = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() => first.result.current.changeSelection([]));
    first.rerender(page({ kind: "subject", subjectSlug: "history" }));
    expect(first.result.current.selectedValues).toEqual([]);
    first.unmount();
    window.sessionStorage.clear();
    const later = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    expect(later.result.current.selectedValues).toEqual([]);
  });

  it("remembers an explicit Unselect all choice on an empty hub page", () => {
    const { result, rerender } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "hub" }),
    });
    act(() => result.current.changeSelection([]));
    rerender(page({ kind: "subject", subjectSlug: "history" }));
    expect(result.current.selectedValues).toEqual([]);
  });

  it("clears manual mode after a successful download", () => {
    const { result, rerender } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() =>
      result.current.changeSelection(["music:primary", "maths:primary"]),
    );
    act(() => result.current.resetSelection());
    expect(result.current.selectedValues).toEqual(["music:primary"]);
    rerender(page({ kind: "subject", subjectSlug: "history" }));
    expect(result.current.selectedValues).toEqual([
      "history:primary",
      "history:secondary",
    ]);
    expect(
      window.localStorage.getItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION),
    ).toBeNull();
  });

  it.each(["not json", '{"selectedValues":[]}', "[1]"])(
    "ignores invalid saved data %s",
    (saved) => {
      const log = jest.spyOn(console, "log").mockImplementation(() => {});
      window.localStorage.setItem(
        LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
        saved,
      );
      const { result } = renderHook(useDownloadSelection, {
        initialProps: page({ kind: "subject", subjectSlug: "music" }),
      });
      expect(result.current.selectedValues).toEqual(["music:primary"]);
      log.mockRestore();
    },
  );

  it("filters unavailable and duplicate saved downloads without adding page defaults", () => {
    window.localStorage.setItem(
      LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
      JSON.stringify([
        "music:primary",
        "music:primary",
        "unknown:primary",
        "music:secondary",
      ]),
    );
    const { result } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "history" }),
    });
    expect(result.current.selectedValues).toEqual(["music:primary"]);
  });

  it("shares explicit choices and resets across open panels", () => {
    const first = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    const other = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "history" }),
    });
    act(() => first.result.current.changeSelection(["maths:primary"]));
    expect(other.result.current.selectedValues).toEqual(["maths:primary"]);
    act(() => other.result.current.resetSelection());
    expect(first.result.current.selectedValues).toEqual(["music:primary"]);
    expect(other.result.current.selectedValues).toEqual([
      "history:primary",
      "history:secondary",
    ]);
  });

  it("updates choices when another tab changes or clears the saved selection", () => {
    const { result } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() => {
      window.localStorage.setItem(
        LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
        JSON.stringify(["maths:primary"]),
      );
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
          storageArea: window.localStorage,
        }),
      );
    });
    expect(result.current.selectedValues).toEqual(["maths:primary"]);
    act(() => {
      window.localStorage.removeItem(LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
          storageArea: window.localStorage,
        }),
      );
    });
    expect(result.current.selectedValues).toEqual(["music:primary"]);
  });

  it("preserves manual mode when none of the saved downloads is still available", () => {
    window.localStorage.setItem(
      LS_KEY_INSIGHTS_MANUAL_DOWNLOAD_SELECTION,
      JSON.stringify(["unknown:primary"]),
    );
    const { result } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    expect(result.current.selectedValues).toEqual([]);
  });

  it("keeps manual choices in the open panel when storage is unavailable", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    const storage = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("Storage blocked", "SecurityError");
      });
    const { result, rerender } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() =>
      result.current.changeSelection(["music:primary", "maths:primary"]),
    );
    rerender(page({ kind: "subject", subjectSlug: "history" }));
    expect(result.current.selectedValues).toEqual([
      "music:primary",
      "maths:primary",
    ]);
    storage.mockRestore();
    act(() => result.current.resetSelection());
    warn.mockRestore();
  });

  it("keeps the picker usable when storage cannot be read", () => {
    const storage = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new DOMException("Storage blocked", "SecurityError");
      });
    const { result, rerender } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    expect(result.current.selectedValues).toEqual(["music:primary"]);
    act(() => result.current.changeSelection(["maths:primary"]));
    rerender(page({ kind: "subject", subjectSlug: "history" }));
    expect(result.current.selectedValues).toEqual(["maths:primary"]);
    storage.mockRestore();
    act(() => result.current.resetSelection());
  });

  it("returns to automatic choices when saved data cannot be removed", () => {
    const { result } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() => result.current.changeSelection(["maths:primary"]));
    const storage = jest
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {
        throw new DOMException("Storage blocked", "SecurityError");
      });
    act(() => result.current.resetSelection());
    expect(result.current.selectedValues).toEqual(["music:primary"]);
    storage.mockRestore();
    act(() => result.current.resetSelection());
  });
});
