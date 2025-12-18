import { OptionsView } from "@oaknational/google-classroom-addon/ui";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getAvailableProgrammeFactor } from "@/pages-helpers/pupil/options-pages/getAvailableProgrammeFactor";

async function GoogleClassroomOptionsPage({
  params,
}: {
  params: Promise<{ programmeSlug: string }>;
}) {
  const { programmeSlug } = await params;
  const programmes = await curriculumApi2023.pupilProgrammeListingQuery({
    baseSlug: programmeSlug,
  });
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
    <OptionsView
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
