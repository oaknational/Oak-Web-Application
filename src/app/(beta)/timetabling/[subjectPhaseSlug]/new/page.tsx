import { CurricTimetablingNewView } from "@/components/CurriculumComponents/CurricTimetablingNewView";

const Page = async ({ params }: { params: { subjectPhaseSlug: string } }) => {
  const { subjectPhaseSlug } = params;
  return <CurricTimetablingNewView subjectPhaseSlug={subjectPhaseSlug} />;
};

export default Page;
