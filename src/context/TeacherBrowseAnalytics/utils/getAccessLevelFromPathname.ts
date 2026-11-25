import type { AccessLevelValueType } from "@/browser-lib/avo/Avo";
import { matchOakHref, OakPageType } from "@/common-lib/urls";

const pagesByAccessLevel: ReadonlyArray<[AccessLevelValueType, OakPageType[]]> =
  [
    [
      "lesson",
      [
        "lesson-overview",
        "lesson-downloads",
        "lesson-downloads-success",
        "lesson-media",
        "lesson-share",
        "lesson-overview-canonical",
        "lesson-downloads-canonical",
        "lesson-media-canonical",
      ],
    ],
    ["unit", ["unit-overview"]],
    ["programme", ["teacher-programme"]],
    ["search", ["search"]],
    ["my_library", ["my-library"]],
    [
      "teach_with_oak",
      [
        "teach-with-oak",
        "teach-with-oak-download",
        "teach-with-oak-download-success",
        "teach-with-oak-thinking-behind-oak-lessons",
      ],
    ],
  ];

export const getAccessLevelFromPathname = (
  pathname: string | null | undefined,
): AccessLevelValueType => {
  if (!pathname) {
    return "homepage";
  }

  return (
    pagesByAccessLevel.find(([, pages]) =>
      pages.some((page) => matchOakHref(pathname, page)),
    )?.[0] ?? "homepage"
  );
};
