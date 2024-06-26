import { GetStaticProps, GetStaticPropsResult } from "next";

import {
  OptionsURLParams,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";
import { PupilViewsProgrammeListingProps } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

// This page is for moving back through pupil journey from subject with examboards and tiers

export { PupilViewsProgrammeListing as default } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

export type OptionsExamboardURLParams = OptionsURLParams & {
  examboardSlug: string;
};
export const getStaticPaths = getStaticPathsTemplate<OptionsExamboardURLParams>;

export const getStaticProps: GetStaticProps<
  PupilViewsProgrammeListingProps,
  OptionsExamboardURLParams
> = async (
  context,
): Promise<GetStaticPropsResult<PupilViewsProgrammeListingProps>> => {
  return getPupilOptionData(context);
};
