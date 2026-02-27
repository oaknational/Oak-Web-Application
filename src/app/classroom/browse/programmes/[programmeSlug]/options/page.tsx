import { notFound } from "next/navigation";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getAvailableProgrammeFactor } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";
import { GoogleClassroomOptionsAnalytics } from "@/components/GoogleClassroom/GoogleClassroomOptionsAnalytics";

async function GoogleClassroomOptionsPage({
  params,
}: Readonly<{
  params: Promise<{ programmeSlug: string }>;
}>) {
  const { programmeSlug } = await params;
  const programmes = await curriculumApi2023.pupilProgrammeListingQuery({
    baseSlug: programmeSlug,
  });
  if (!programmes?.length) {
    notFound();
  }

  const yearSlug = programmes?.find((p) => !!p.yearSlug)?.yearSlug;
  const getBackUrl = () =>
    yearSlug
      ? `/classroom/browse/years/:yearSlug/subjects`
      : `/classroom/browse`;
  const getAvailableProgrammeFactorAction = async (args: {
    factorPrefix: "tier" | "examboard" | "pathway";
  }) => {
    "use server";
    return getAvailableProgrammeFactor({
      ...args,
      programmes,
    });
  };
  return (
    <GoogleClassroomOptionsAnalytics
      programmes={programmes}
      baseSlug={programmeSlug}
      yearSlug={yearSlug}
      programmeUrlTemplate={"/classroom/browse/programmes/:programmeSlug/units"}
      backUrlTemplate={getBackUrl()}
      getAvailableProgrammeFactorAction={getAvailableProgrammeFactorAction}
    />
  );
}

export default GoogleClassroomOptionsPage;
