import { usePathname } from "next/navigation";

import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";

export type JourneySlugs = {
  subjectSlug: string;
  phaseSlug: string;
};

const useJourneySlugsContext = (): JourneySlugs => {
  const pathname = usePathname();
  let parsed: ReturnType<typeof parseSubjectPhaseSlug> | undefined;
  for (const segment of pathname?.split("/") ?? []) {
    const result = parseSubjectPhaseSlug(segment);
    if (result) {
      parsed = result;
      break;
    }
  }

  return {
    subjectSlug: parsed?.subjectSlug ?? "unknown",
    phaseSlug: parsed?.phaseSlug ?? "unknown",
  };
};

export default useJourneySlugsContext;
