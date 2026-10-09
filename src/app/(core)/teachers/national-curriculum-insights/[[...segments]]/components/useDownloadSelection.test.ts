import { act, renderHook } from "@testing-library/react";

import { hubData } from "../__fixtures__/stories";
import type { NationalCurriculumInsightsRouteData } from "../helpers/getRouteData";

import {
  getPageDownloadSelection,
  useDownloadSelection,
} from "./useDownloadSelection";

import { LS_KEY_INSIGHTS_DOWNLOAD_SELECTION } from "@/config/localStorageKeys";

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

beforeEach(() => window.localStorage.clear());

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
        window.localStorage.getItem(LS_KEY_INSIGHTS_DOWNLOAD_SELECTION)!,
      ),
    ).toEqual(chosen);
  });

  it("restores manual choices when the component mounts in a later session", () => {
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
    const later = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    expect(later.result.current.selectedValues).toEqual([]);
  });

  it("does not leave automatic mode when choices have not changed", () => {
    const { result, rerender } = renderHook(useDownloadSelection, {
      initialProps: page({ kind: "subject", subjectSlug: "music" }),
    });
    act(() => result.current.changeSelection(["music:primary"]));
    rerender(page({ kind: "subject", subjectSlug: "history" }));
    expect(result.current.selectedValues).toEqual([
      "history:primary",
      "history:secondary",
    ]);
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
      window.localStorage.getItem(LS_KEY_INSIGHTS_DOWNLOAD_SELECTION),
    ).toBe("null");
  });

  it.each(["not json", '{"selectedValues":[]}', "[1]"])(
    "ignores invalid saved data %s",
    (saved) => {
      const log = jest.spyOn(console, "log").mockImplementation(() => {});
      window.localStorage.setItem(LS_KEY_INSIGHTS_DOWNLOAD_SELECTION, saved);
      const { result } = renderHook(useDownloadSelection, {
        initialProps: page({ kind: "subject", subjectSlug: "music" }),
      });
      expect(result.current.selectedValues).toEqual(["music:primary"]);
      log.mockRestore();
    },
  );

  it("filters unavailable and duplicate saved downloads without adding page defaults", () => {
    window.localStorage.setItem(
      LS_KEY_INSIGHTS_DOWNLOAD_SELECTION,
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
    warn.mockRestore();
  });
});
