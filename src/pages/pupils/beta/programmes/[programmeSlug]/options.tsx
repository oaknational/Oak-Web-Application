// TESTING
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options

import { GetStaticPathsResult, GetStaticProps } from "next";
import { OakHeading } from "@oaknational/oak-components";

import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { PupilProgrammeListingData } from "@/node-lib/curriculum-api-2023/queries/pupilProgrammeListing/pupilProgrammeListing.schema";

type URLParams = {
  programmeSlug: string;
};
type ProgrammesPageProps = {
  programmes: PupilProgrammeListingData[];
};

const ProgrammesPage = ({ programmes }: ProgrammesPageProps) => {
  return (
    <>
      <OakHeading tag="h1">Programmes Listing Page</OakHeading>
      {programmes.map((programme) => (
        <div key={programme.programmeSlug}>
          <OakHeading tag="h2">{programme.programmeSlug}</OakHeading>
        </div>
      ))}
    </>
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
    isLegacy: true,
  });

  if (!programmes) {
    return {
      notFound: true,
    };
  }

  return {
    props: { programmes },
  };
};

export default ProgrammesPage;
