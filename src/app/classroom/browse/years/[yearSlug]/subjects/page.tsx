import { notFound } from "next/navigation";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { GoogleClassroomSubjectsAnalytics } from "@/components/GoogleClassroom/GoogleClassroomSubjectsAnalytics";

async function GoogleClassroomSubjectsPage({
  params,
}: Readonly<{
  params: Promise<{ yearSlug: string }>;
}>) {
  const { yearSlug } = await params;

  const { curriculumData } = await curriculumApi2023.pupilSubjectListingQuery({
    yearSlug: yearSlug,
  });
  if (!curriculumData[0]) {
    notFound();
  }

  return (
    <GoogleClassroomSubjectsAnalytics
      subjects={curriculumData}
      unitsUrlTemplate={"/classroom/browse/programmes/:programmeSlug/units"}
      optionsUrlTemplate={"/classroom/browse/programmes/:programmeSlug/options"}
    />
  );
}

export default GoogleClassroomSubjectsPage;
