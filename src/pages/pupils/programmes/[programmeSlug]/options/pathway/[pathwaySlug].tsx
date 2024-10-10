import { GetStaticProps, GetStaticPropsResult } from "next";

import {
  OptionsURLParams,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { PupilViewsProgrammeListingProps } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

// This page is for moving back through pupil journey from subject with pathways and examboards

export { PupilViewsProgrammeListing as default } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

export type OptionsPathwayURLParams = OptionsURLParams & {
  pathwaySlug: string;
};
export const getStaticPaths = getStaticPathsTemplate<OptionsPathwayURLParams>;

export const getStaticProps: GetStaticProps<
  PupilViewsProgrammeListingProps,
  OptionsPathwayURLParams
> = async (
  context,
): Promise<GetStaticPropsResult<PupilViewsProgrammeListingProps>> => {
  return getPupilOptionData(context);
};
