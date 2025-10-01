import { CurricTimetablingUnits } from "@/components/CurriculumComponents/CurricTimetablingUnits";

const Page = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  // Render
  return <CurricTimetablingUnits subjectPhaseSlug={params.subjectPhaseSlug} />;
};

export default Page;
