import { CurricTimetablingNameView } from "@/components/CurriculumComponents/CurricTimetablingNameView";

const Page = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  const { subjectPhaseSlug } = await params;
  return <CurricTimetablingNameView subjectPhaseSlug={subjectPhaseSlug} />;
};

export default Page;
