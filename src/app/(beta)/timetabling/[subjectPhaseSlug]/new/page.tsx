import { CurricTimetablingNewView } from "@/components/CurriculumComponents/CurricTimetablingNewView";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";

const Page = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  const { subjectPhaseSlug } = await params;
  const slugs = parseSubjectPhaseSlug(subjectPhaseSlug);

  const curriculumPhaseOptions =
    await curriculumApi2023.curriculumPhaseOptions();
  const subject = curriculumPhaseOptions.find(
    (s) => s.slug === slugs?.subjectSlug,
  );

  return (
    <CurricTimetablingNewView
      subjectPhaseSlug={subjectPhaseSlug}
      subjectTitle={subject?.title}
    />
  );
};

export default Page;
