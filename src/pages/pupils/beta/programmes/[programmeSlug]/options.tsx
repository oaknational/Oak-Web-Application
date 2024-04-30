// TESTING
// http://localhost:3000/pupils/beta/programmes/biology-secondary-year-11/options
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-11/options (should 404)

import { GetStaticPathsResult, GetStaticProps } from "next";
import { useSearchParams } from "next/navigation";

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
  isExamboardSlug,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import OakError from "@/errors/OakError";

const ProgrammesPage = ({
  programmes,
  baseSlug,
  yearSlug,
}: ProgrammesPageProps) => {
  const searchParams = useSearchParams();

  const examboardSlug = (() => {
    const e = searchParams.get("examboard");
    if (!e) return null;
    if (!isExamboardSlug(e)) {
      throw new OakError({ code: "curriculum-api/params-incorrect" });
    }
    return e;
  })();

  return (
    <PupilViewsProgrammeListing
      programmes={programmes}
      baseSlug={baseSlug}
      isLegacy={false}
      yearSlug={yearSlug}
      examboardSlug={examboardSlug}
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
    isLegacy: false,
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
