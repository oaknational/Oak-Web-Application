import { notFound } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";

const Page = async () => {
  const isEnabled = await useFeatureFlag("adopt-timetabling-proto", "boolean");
  if (!isEnabled) {
    return notFound();
  }
  return <p>View timetable</p>;
};

export default Page;
