// TESTING
// http://localhost:3000/pupils/programmes/biology-secondary-year-11/options
// http://localhost:3000/pupils/programmes/maths-secondary-year-10/options
// http://localhost:3000/pupils/programmes/maths-secondary-year-11/options (should 404)

import { GetStaticProps } from "next";
import { useSearchParams } from "next/navigation";

import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import {
  ProgrammesPageProps,
  OptionsURLParams,
  isExamboardSlug,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import OakError from "@/errors/OakError";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

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
        isLegacy={false}
        yearSlug={yearSlug}
        examboardSlug={examboardSlug}
      />
    </AppLayout>
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
