import { notFound } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";
import { CurricTimetablingUnits } from "@/components/CurriculumComponents/CurricTimetablingUnits";

const Page = async () => {
  const isEnabled = await useFeatureFlag("adopt-timetabling-proto", "boolean");

  if (!isEnabled) {
    return notFound();
  }

  return <CurricTimetablingUnits />;
};

export default Page;
