import { CurricTimetablingNewView } from "@/components/CurriculumComponents/CurricTimetablingNewView";

const Page = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  const { subjectPhaseSlug } = await params;
  return <CurricTimetablingNewView subjectPhaseSlug={subjectPhaseSlug} />;
};

export default Page;
