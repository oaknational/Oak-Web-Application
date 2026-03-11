import { SubjectsPageView } from "@oaknational/google-classroom-addon/ui";
import { notFound } from "next/navigation";

import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

async function getSubjectsData(yearSlug: string) {
  try {
    return await curriculumApi2023.pupilSubjectListingQuery({ yearSlug });
  } catch (error) {
    if (
      error instanceof OakError &&
      error.code === "curriculum-api/not-found"
    ) {
      notFound();
    }
    throw error;
  }
}

async function GoogleClassroomSubjectsPage({
  params,
}: Readonly<{
  params: Promise<{ yearSlug: string }>;
}>) {
  const { yearSlug } = await params;

  const { curriculumData } = await getSubjectsData(yearSlug);

  if (!curriculumData.length) {
    notFound();
  }

  return (
    <SubjectsPageView
      subjects={curriculumData}
      unitsUrlTemplate={"/classroom/browse/programmes/:programmeSlug/units"}
      optionsUrlTemplate={"/classroom/browse/programmes/:programmeSlug/options"}
    />
  );
}

export default GoogleClassroomSubjectsPage;
