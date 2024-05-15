// TESTING
// http://localhost:3000/pupils/beta/programmes/biology-secondary-year-11/options
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-10/options
// http://localhost:3000/pupils/beta/programmes/maths-secondary-year-11/options (should 404)

import { GetStaticProps } from "next";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import {
  ProgrammesPageProps,
  OptionsURLParams,
  isExamboardSlug,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import OakError from "@/errors/OakError";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { ExamboardData } from "@/components/PupilComponents/BrowseExamboardSelector";

const ProgrammesPage = ({
  programmes,
  baseSlug,
  yearSlug,
}: ProgrammesPageProps) => {
  const searchParams = useSearchParams();
  const [examboardSlug, setExamboardSlug] =
    useState<ExamboardData["examboardSlug"]>(null);

  useEffect(() => {
    const e = searchParams.get("examboard");
    if (!e) return;
    if (!isExamboardSlug(e)) {
      throw new OakError({ code: "curriculum-api/params-incorrect" });
    }
    setExamboardSlug(e);
  }, [searchParams]);

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

export const getStaticPaths = getStaticPathsTemplate<OptionsURLParams>;

export const getStaticProps: GetStaticProps<
  ProgrammesPageProps,
  OptionsURLParams
> = (context) => {
  return getPupilOptionData(context);
};

export default ProgrammesPage;
