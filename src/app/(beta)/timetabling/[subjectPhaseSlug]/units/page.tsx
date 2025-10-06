import { CurricTimetablingUnits } from "@/components/CurriculumComponents/CurricTimetablingUnits";

const Page = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  const { subjectPhaseSlug } = await params;
  return <CurricTimetablingUnits subjectPhaseSlug={subjectPhaseSlug} />;
};

export default Page;
