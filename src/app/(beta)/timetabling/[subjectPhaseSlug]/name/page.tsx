import { notFound } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";
import { CurricTimetablingNameView } from "@/components/CurriculumComponents/CurricTimetablingNameView";

const Page = async ({
  params,
}: {
  params: Promise<{ subjectPhaseSlug: string }>;
}) => {
  const { subjectPhaseSlug } = await params;
  const isEnabled = await useFeatureFlag("adopt-timetabling-proto", "boolean");
  if (!isEnabled) {
    return notFound();
  }
  return <CurricTimetablingNameView subjectPhaseSlug={subjectPhaseSlug} />;
};

export default Page;
