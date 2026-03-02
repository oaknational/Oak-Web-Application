import { SubjectsPageView } from "@oaknational/google-classroom-addon/ui";
import { notFound } from "next/navigation";

import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

async function GoogleClassroomSubjectsPage({
  params,
}: Readonly<{
  params: Promise<{ yearSlug: string }>;
}>) {
  const { yearSlug } = await params;

  try {
    const { curriculumData } = await curriculumApi2023.pupilSubjectListingQuery(
      {
        yearSlug: yearSlug,
      },
    );
    if (!curriculumData[0]) {
      notFound();
    }

    return (
      <SubjectsPageView
        subjects={curriculumData}
        unitsUrlTemplate={"/classroom/browse/programmes/:programmeSlug/units"}
        optionsUrlTemplate={
          "/classroom/browse/programmes/:programmeSlug/options"
        }
      />
    );
  } catch (error) {
    if (error instanceof OakError && error.config.responseStatusCode === 404) {
      notFound();
    }
    throw error;
  }
}

export default GoogleClassroomSubjectsPage;
