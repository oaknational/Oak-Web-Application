import { GetStaticProps, GetStaticPropsResult } from "next";

import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import {
  ProgrammesPageProps,
  OptionsURLParams,
  isExamboardSlug,
  getYearSlug,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import OakError from "@/errors/OakError";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import AppLayout from "@/components/SharedComponents/AppLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

const ProgrammesPage = ({
  programmes,
  baseSlug,
  yearSlug,
  examboardSlug,
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
        yearSlug={yearSlug}
        examboardSlug={examboardSlug}
      />
    </AppLayout>
  );
};
export type OptionsExamboardURLParams = OptionsURLParams & {
  examboardSlug: string;
};
export const getStaticPaths = getStaticPathsTemplate<OptionsExamboardURLParams>;

export const getStaticProps: GetStaticProps<
  ProgrammesPageProps,
  OptionsExamboardURLParams
> = async (context): Promise<GetStaticPropsResult<ProgrammesPageProps>> => {
  if (!context.params) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  // For the options path rename programmeSlug to baseSlug as this is the accurate usage of the options page.
  // I would have created a new folder [baseSlug] but multiple dynamic params on the same segment is not allowed.
  const { programmeSlug: baseSlug, examboardSlug } = context.params;

  if (!baseSlug) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  const programmes = await curriculumApi2023.pupilProgrammeListingQuery({
    baseSlug,
  });

  if (!programmes || programmes.length === 0) {
    return {
      notFound: true,
    };
  }

  const yearSlug = getYearSlug({ programmes });

  if (!isExamboardSlug(examboardSlug)) {
    throw new OakError({ code: "curriculum-api/params-incorrect" });
  }

  return {
    props: { programmes, baseSlug, yearSlug, examboardSlug },
  };
};

export default ProgrammesPage;
