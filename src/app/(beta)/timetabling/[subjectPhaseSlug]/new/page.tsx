import { notFound } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";
import { CurricTimetablingNewView } from "@/components/CurriculumComponents/CurricTimetablingNewView";

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

  return <CurricTimetablingNewView subjectPhaseSlug={subjectPhaseSlug} />;
};

export default Page;
