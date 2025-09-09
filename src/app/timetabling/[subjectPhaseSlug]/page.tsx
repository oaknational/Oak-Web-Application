import { Timetabling } from "./Timetabling";

import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

type TimetablingPageProps = {
  params: Promise<{ subjectPhaseSlug: string }>;
};
export default async function TimetablingPage(props: TimetablingPageProps) {
  const params = await props.params;
  const slugs = parseSubjectPhaseSlug(params.subjectPhaseSlug);

  if (!slugs) {
    return <div>404</div>;
  }

  const sequence = await curriculumApi2023.curriculumSequence(slugs);
  return <Timetabling sequence={sequence.units ?? []} {...slugs} />;
}
