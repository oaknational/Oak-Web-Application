// TESTING
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options-l
// CF http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options

import { GetStaticProps } from "next";

import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import {
  ProgrammesPageProps,
  OptionsURLParams,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

const ProgrammesPage = ({
  programmes,
  baseSlug,
  yearSlug,
}: ProgrammesPageProps) => {
  const subjectDescription = programmes[0]?.programmeFields.subject;
  const yearDescriptions = programmes[0]?.programmeFields.yearDescription;
  const phaseSlug = programmes[0]?.programmeFields.phaseSlug;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `${subjectDescription}, ${phaseSlug}, ${yearDescriptions} - Programme listing`,
          description: `Programme listing for ${subjectDescription}, ${phaseSlug}, ${yearDescriptions}`,
        }),
      }}
    >
      {" "}
      <PupilViewsProgrammeListing
        programmes={programmes}
        baseSlug={baseSlug}
        isLegacy={true}
        yearSlug={yearSlug}
      />
    </AppLayout>
  );
};

export const getStaticPaths = getStaticPathsTemplate<OptionsURLParams>;

export const getStaticProps: GetStaticProps<
  ProgrammesPageProps,
  OptionsURLParams
> = async (context) => {
  return getPupilOptionData(context, true);
};

export default ProgrammesPage;
