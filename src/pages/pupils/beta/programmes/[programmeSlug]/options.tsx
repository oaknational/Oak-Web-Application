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
import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import {
  ProgrammesPageProps,
  OptionsURLParams,
  isExamboardSlug,
  getPupilOptionData,
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

  const config: GetStaticPathsResult<OptionsURLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  ProgrammesPageProps,
  OptionsURLParams
> = (context) => {
  return getPupilOptionData(context);
};

export default ProgrammesPage;
