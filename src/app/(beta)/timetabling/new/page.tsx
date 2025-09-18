import { notFound } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";
import { CurricTimetablingNewView } from "@/components/CurriculumComponents/CurricTimetablingNewView";

const Page = async () => {
  const { isEnabled } = await useFeatureFlag("adopt-timetabling-proto");

  if (!isEnabled) {
    return notFound();
  }

  return <CurricTimetablingNewView />;
};

export default Page;
