import { FileFormat, type SchoolOptionValueType } from "@/browser-lib/avo/Avo";
import { nationalCurriculumInsightsPhaseSchema } from "@/common-lib/cms-types/nationalCurriculumInsights";

export function getDownloadAnalyticsProperties({
  selectedValues,
  email,
  schoolOption,
  schoolUrn,
  downloadAttemptId,
}: {
  selectedValues: string[];
  email: string;
  schoolOption: SchoolOptionValueType;
  schoolUrn: string | null;
  downloadAttemptId: string;
}) {
  const selectedDownloadKeys = [...new Set(selectedValues)];
  const selections = selectedDownloadKeys.map((key) => {
    const [subjectSlug, phase] = key.split(":");
    if (!subjectSlug) throw new Error("Missing download subject");
    return {
      subjectSlug,
      phase: nationalCurriculumInsightsPhaseSchema.parse(phase),
    };
  });

  return {
    downloadAttemptId,
    selectedDownloadKeys,
    selectedSubjectSlugs: [
      ...new Set(selections.map(({ subjectSlug }) => subjectSlug)),
    ],
    selectedPhases: [...new Set(selections.map(({ phase }) => phase))],
    documentCount: selectedDownloadKeys.length,
    fileFormat:
      selectedDownloadKeys.length > 1 ? FileFormat.ZIP : FileFormat.DOCX,
    emailSupplied: email.trim().length > 0,
    schoolOption,
    schoolUrn,
  };
}
