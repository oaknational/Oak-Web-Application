import { usePathname } from "next/navigation";

import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";

export type JourneySlugs = {
  subjectSlug: string;
  phaseSlug: string;
};

const useJourneySlugsContext = (): JourneySlugs => {
  const pathname = usePathname();
  const subjectPhaseSegment = pathname
    ?.split("/")
    .find((segment) => segment.includes("-"));

  const parsed = parseSubjectPhaseSlug(subjectPhaseSegment ?? "");

  return {
    subjectSlug: parsed?.subjectSlug ?? "unknown",
    phaseSlug: parsed?.phaseSlug ?? "unknown",
  };
};

export default useJourneySlugsContext;
