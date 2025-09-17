import { notFound } from "next/navigation";

import { useFeatureFlag } from "@/utils/featureFlags";

const Page = async () => {
  const { isEnabled } = await useFeatureFlag("adopt-timetabling-proto");
  if (!isEnabled) {
    return notFound();
  }
  return <p>Input name</p>;
};

export default Page;
