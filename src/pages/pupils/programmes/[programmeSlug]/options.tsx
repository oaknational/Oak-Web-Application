// TESTING
// http://localhost:3000/pupils/programmes/biology-secondary-year-11/options
// http://localhost:3000/pupils/programmes/maths-secondary-year-10/options
// http://localhost:3000/pupils/programmes/maths-secondary-year-11/options (should 404)

import { GetStaticProps } from "next";

import {
  ProgrammesPageProps,
  OptionsURLParams,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";

export { PupilViewsProgrammeListing as default } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

export const getStaticPaths = getStaticPathsTemplate<OptionsURLParams>;

export const getStaticProps: GetStaticProps<
  ProgrammesPageProps,
  OptionsURLParams
> = (context) => {
  return getPupilOptionData(context);
};
