import { GetStaticProps } from "next";

import {
  OptionsURLParams,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { PupilViewsProgrammeListingProps } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

export { PupilViewsProgrammeListing as default } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

export const getStaticPaths = getStaticPathsTemplate<OptionsURLParams>;

export const getStaticProps: GetStaticProps<
  PupilViewsProgrammeListingProps,
  OptionsURLParams
> = (context) => {
  return getPupilOptionData(context);
};
