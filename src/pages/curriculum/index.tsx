import { GetStaticProps, NextPage } from "next";

import { isCycleTwoEnabled } from "@/utils/curriculum/features";
import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import HomePageBanner from "@/components/CurriculumComponents/Banner";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import CurriculumTab from "@/components/GenericPagesComponents/CurriculumTab";
import {
  getPropsFunction,
  HomePageProps,
} from "@/pages-helpers/home/getBlogPosts";

const cycleTwoEnabled = isCycleTwoEnabled();

const Curriculum: NextPage<HomePageProps> = (props) => (
  <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
    {cycleTwoEnabled ? (
      <HomePageBanner
        background="lemon"
        newText="Subjects added"
        ctaText="See curriculum plans"
        page="curriculum-landing-page"
      />
    ) : null}
    <HomePageTabImageNav current={"curriculum"} />
    <CurriculumTab aria-current="page" />
    <HomePageLowerView posts={props.posts} />
  </AppLayout>
);

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "curriculum-home-page::getStaticProps",
    context,
    getProps: getPropsFunction(context),
  });
};

export default Curriculum;
