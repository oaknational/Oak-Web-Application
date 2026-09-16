import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { parseProgrammeSlug } from "@/utils/curriculum/slugs";

export const extractLessonPropsFromHref = (href: string) => {
  const baseUrl = getBrowserConfig("clientAppBaseUrl");

  let pathname: string;

  try {
    pathname = new URL(href, baseUrl).pathname;
  } catch {
    pathname = href;
  }

  const segments = pathname.split("/").filter(Boolean);

  if (
    segments[0] !== "teachers" ||
    segments[1] !== "programmes" ||
    segments[3] !== "units" ||
    segments[5] !== "lessons"
  ) {
    return null;
  }

  const programmeSlug = segments[2];
  const unitSlug = segments[4];
  const lessonSlug = segments[6];

  if (!programmeSlug || !unitSlug || !lessonSlug) {
    return null;
  }

  const parsedProgrammeSlug = parseProgrammeSlug(programmeSlug);

  if (!parsedProgrammeSlug) {
    return null;
  }

  const { keystageSlug, tierSlug, pathwaySlug, examboardSlug } =
    parsedProgrammeSlug;

  return {
    unitSlug,
    lessonSlug,
    keystageSlug,
    tierSlug,
    pathwaySlug,
    examboardSlug,
  };
};
