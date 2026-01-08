import { notFound } from "next/navigation";

import EYFSSubjectsView from "./EYFSSubjectsView";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export default async function EYFSPage() {
  try {
    const curriculumData = await curriculumApi2023.eyfsListing();
    return <EYFSSubjectsView curriculumData={curriculumData} />;
  } catch {
    return {
      notFound,
    };
  }
}
