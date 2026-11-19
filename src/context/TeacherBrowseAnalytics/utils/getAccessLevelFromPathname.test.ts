import { getAccessLevelFromPathname } from "./getAccessLevelFromPathname";

import { resolveOakHref } from "@/common-lib/urls";

const programmeSlug = "biology-secondary-ks3";
const unitSlug = "cells";
const lessonSlug = "lesson-1";

describe("getAccessLevelFromPathname", () => {
  it.each([
    [
      resolveOakHref({
        page: "lesson-overview",
        programmeSlug,
        unitSlug,
        lessonSlug,
      }),
      "lesson",
    ],
    [
      resolveOakHref({
        page: "lesson-downloads",
        programmeSlug,
        unitSlug,
        lessonSlug,
      }),
      "lesson",
    ],
    [
      resolveOakHref({
        page: "lesson-downloads-success",
        programmeSlug,
        unitSlug,
        lessonSlug,
      }),
      "lesson",
    ],
    [
      resolveOakHref({
        page: "lesson-media",
        programmeSlug,
        unitSlug,
        lessonSlug,
      }),
      "lesson",
    ],
    [
      resolveOakHref({
        page: "lesson-share",
        programmeSlug,
        unitSlug,
        lessonSlug,
      }),
      "lesson",
    ],
    [
      resolveOakHref({ page: "lesson-overview-canonical", lessonSlug }),
      "lesson",
    ],
    [resolveOakHref({ page: "lesson-media-canonical", lessonSlug }), "lesson"],
    [
      resolveOakHref({
        page: "lesson-downloads-canonical",
        lessonSlug,
        downloads: "downloads",
      }),
      "lesson",
    ],
    [
      resolveOakHref({ page: "unit-overview", programmeSlug, unitSlug }),
      "unit",
    ],
    [
      resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug: "biology-secondary",
        tab: "units",
      }),
      "programme",
    ],
    [resolveOakHref({ page: "search" }), "search"],
    [resolveOakHref({ page: "my-library" }), "my_library"],
    [resolveOakHref({ page: "teach-with-oak" }), "teach_with_oak"],
    [resolveOakHref({ page: "teach-with-oak-download" }), "teach_with_oak"],
    [
      resolveOakHref({ page: "teach-with-oak-download-success" }),
      "teach_with_oak",
    ],
    [
      resolveOakHref({ page: "teach-with-oak-thinking-behind-oak-lessons" }),
      "teach_with_oak",
    ],
    ["/teachers/search/", "search"],
  ])("maps %s to %s", (pathname, expected) => {
    expect(getAccessLevelFromPathname(pathname)).toBe(expected);
  });

  it.each([
    null,
    undefined,
    resolveOakHref({ page: "home" }),
    resolveOakHref({ page: "eyfs-page", subjectSlug: "maths" }),
    resolveOakHref({ page: "about-who-we-are" }),
  ])("falls back to homepage for %s", (pathname) => {
    expect(getAccessLevelFromPathname(pathname)).toBe("homepage");
  });
});
