// TESTING
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options-l
// CF http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options

import { GetStaticPathsResult, GetStaticProps } from "next";

import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import {
  ProgrammesPageProps,
  OptionsURLParams,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";

const ProgrammesPage = ({
  programmes,
  baseSlug,
  yearSlug,
}: ProgrammesPageProps) => {
  return (
    <PupilViewsProgrammeListing
      programmes={programmes}
      baseSlug={baseSlug}
      isLegacy={true}
      yearSlug={yearSlug}
    />
  );
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<OptionsURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  ProgrammesPageProps,
  OptionsURLParams
> = async (context) => {
  return getPupilOptionData(context, true);
};

export default ProgrammesPage;
