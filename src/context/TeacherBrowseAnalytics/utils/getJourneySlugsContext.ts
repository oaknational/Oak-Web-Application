import { usePathname } from "next/navigation";

import {
  parseProgrammeSlug,
  parseSubjectPhaseSlug,
} from "@/utils/curriculum/slugs";

export type JourneySlugs = {
  subjectSlug: string;
  phaseSlug: string;
};

export const getProgrammeSlugFromPathname = (
  pathname: string | null | undefined,
): string | null => {
  for (const segment of pathname?.split("/") ?? []) {
    if (parseProgrammeSlug(segment) || parseSubjectPhaseSlug(segment)) {
      return segment;
    }
  }

  return null;
};

const useJourneySlugsContext = (): JourneySlugs => {
  const pathname = usePathname();
  const programmeSlug = getProgrammeSlugFromPathname(pathname);
  const parsed = programmeSlug
    ? (parseProgrammeSlug(programmeSlug) ??
      parseSubjectPhaseSlug(programmeSlug))
    : null;

  return {
    subjectSlug: parsed?.subjectSlug ?? "null",
    phaseSlug: parsed?.phaseSlug ?? "null",
  };
};

export default useJourneySlugsContext;
