import { GetStaticProps, GetStaticPropsResult } from "next";

//import { PupilViewsProgrammeListing } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";
import {
  ProgrammesPageProps,
  OptionsURLParams,
  getPupilOptionData,
} from "@/pages-helpers/pupil/options-pages/options-pages-helpers";
import { getStaticPaths as getStaticPathsTemplate } from "@/pages-helpers/get-static-paths";

// This page is for moving back through pupil journey from subject with examboards and tiers

export { PupilViewsProgrammeListing as default } from "@/components/PupilViews/PupilProgrammeListing/PupilProgrammeListing.view";

export type OptionsExamboardURLParams = OptionsURLParams & {
  examboardSlug: string;
};
export const getStaticPaths = getStaticPathsTemplate<OptionsExamboardURLParams>;

export const getStaticProps: GetStaticProps<
  ProgrammesPageProps,
  OptionsExamboardURLParams
> = async (context): Promise<GetStaticPropsResult<ProgrammesPageProps>> => {
  return getPupilOptionData(context);
};
