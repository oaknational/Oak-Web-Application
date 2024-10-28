import { GetStaticProps, NextPage } from "next";

import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import Banners from "@/components/CurriculumComponents/Banners";
import { HomePageLowerView } from "@/components/GenericPagesViews/HomePageLower/HomePageLower.view";
import CurriculumTab from "@/components/GenericPagesComponents/CurriculumTab";
import {
  getPropsFunction,
  HomePageProps,
} from "@/pages-helpers/home/getBlogPosts";

const Curriculum: NextPage<HomePageProps> = (props) => (
  <AppLayout
    seoProps={{
      title:
        "Free curriculum plans aligned with National Curriculum  | Oak National Academy",
      description:
        "Discover our free curriculum plans across subjects from KS1 to KS4, all high-quality, fully-sequenced and aligned with the national curriculum.",
    }}
    $background={"white"}
  >
    <Banners />
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
