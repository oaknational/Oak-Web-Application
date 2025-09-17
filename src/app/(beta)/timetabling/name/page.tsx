import { notFound } from "next/navigation";

import { useTimetablingRoute } from "@/utils/curriculum/timetabling";

const Page = async () => {
  const isEnabled = await useTimetablingRoute();
  if (!isEnabled) {
    return notFound();
  }
  return <p>Input name</p>;
};

export default Page;
