import { notFound } from "next/navigation";

import { CurricTimetablingUnits } from "@/components/CurriculumComponents/CurricTimetablingUnits";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { fetchSubjectPhasePickerData } from "@/pages-helpers/curriculum/docx/tab-helpers";

const Page = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string; unitSlug?: string[] }>;
}) => {
  const { subjectPhaseSlug, unitSlug } = await params;
  const slugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  if (!slugs) {
    return notFound();
  }

  const selectedUnitSlug = unitSlug?.[0];

  // Fetch the data
  const sequence = await curriculumApi2023.curriculumSequence(slugs);
  const curriculumPhaseOptions = await fetchSubjectPhasePickerData();

  // Render
  return (
    <CurricTimetablingUnits
      slugs={slugs}
      units={sequence.units}
      curriculumPhaseOptions={curriculumPhaseOptions}
      selectedUnitSlug={selectedUnitSlug}
    />
  );
};

export default Page;
