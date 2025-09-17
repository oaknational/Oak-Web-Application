import { notFound } from "next/navigation";

import { useTimetablingRoute } from "@/utils/curriculum/timetabling";
import { CurricTimetablingNewView } from "@/components/CurriculumComponents/CurricTimetablingNewView";

const Page = async () => {
  const isEnabled = await useTimetablingRoute();

  if (!isEnabled) {
    return notFound();
  }

  return <CurricTimetablingNewView />;
};

export default Page;
