// TESTING
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options-l
// CF http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options

import { GetStaticPathsResult, GetStaticProps } from "next";

import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import {
  ProgrammesPageProps,
  URLParams,
  getYearSlug,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import OakError from "@/errors/OakError";

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

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  ProgrammesPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }
  const { programmeSlug } = context.params;

  if (!programmeSlug) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  // construct a base slug for the subject

  const programmes = await curriculumApi2023.pupilProgrammeListingQuery({
    baseSlug: programmeSlug,
    isLegacy: true,
  });

  if (!programmes) {
    return {
      notFound: true,
    };
  }

  const yearSlug = getYearSlug({ programmes });

  return {
    props: { programmes, baseSlug: programmeSlug, yearSlug },
  };
};

export default ProgrammesPage;
