// TESTING
// http://localhost:3000/pupils/beta/programmes/biology-secondary-year-11/options
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-11/options (should 404)

import { GetStaticPathsResult, GetStaticProps } from "next";

import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";
import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

type URLParams = {
  programmeSlug: string;
};
type ProgrammesPageProps = {
  baseSlug: string;
  programmes: PupilProgrammeListingData[];
};

const ProgrammesPage = ({ programmes, baseSlug }: ProgrammesPageProps) => {
  return (
    <PupilViewsProgrammeListing
      programmes={programmes}
      baseSlug={baseSlug}
      isLegacy={false}
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
    throw new Error("no context.params");
  }
  const { programmeSlug } = context.params;
  if (!programmeSlug) {
    throw new Error("unexpected context.params");
  }

  // construct a base slug for the subject

  const programmes = await curriculumApi2023.pupilProgrammeListingQuery({
    baseSlug: programmeSlug,
    isLegacy: false,
  });

  if (!programmes) {
    return {
      notFound: true,
    };
  }

  return {
    props: { programmes, baseSlug: programmeSlug },
  };
};

export default ProgrammesPage;
