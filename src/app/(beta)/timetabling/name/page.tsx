import { notFound } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";
import { CurricTimetablingNameView } from "@/components/CurriculumComponents/CurricTimetablingNameView";

const Page = async () => {
  const isEnabled = await useFeatureFlag("adopt-timetabling-proto", "boolean");
  if (!isEnabled) {
    return notFound();
  }
  return <CurricTimetablingNameView />;
};

export default Page;
