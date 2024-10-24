import { GetStaticProps, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import Banners from "@/components/CurriculumComponents/Banners";
import PupilTab from "@/components/GenericPagesComponents/PupilTab";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import {
  getPropsFunction,
  HomePageProps,
} from "@/pages-helpers/home/getBlogPosts";

const Pupils: NextPage<HomePageProps> = (props) => (
  <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"white"}>
    <Banners />
    <HomePageTabImageNav current={"pupils"} />
    <PupilTab aria-current="page" />
    <HomePageLowerView posts={props.posts} />
  </AppLayout>
);

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "pupils-home-page::getStaticProps",
    context,
    getProps: getPropsFunction(context),
  });
};

export default Pupils;
