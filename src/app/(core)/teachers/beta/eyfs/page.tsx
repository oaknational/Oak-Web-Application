import { notFound } from "next/navigation";

import EYFSSubjectsView from "./EYFSSubjectsView";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";

export default async function EYFSPage() {
  try {
    const curriculumData = await curriculumApi2023.eyfsListing();
    return <EYFSSubjectsView curriculumData={curriculumData} />;
  } catch (error) {
    if (error instanceof OakError) {
      if (error.config.responseStatusCode === 404) {
        return notFound();
      }
    }
    // TD: [integrated journey] error reporting
    throw error;
  }
}
