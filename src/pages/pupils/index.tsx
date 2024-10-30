import { GetStaticProps, NextPage } from "next";

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
  <AppLayout
    seoProps={{
      title:
        "Free online lessons, videos and quizzes for pupils | Oak National Academy",
      description:
        "Looking for online lessons from KS1 to KS4? Browse and find free videos, quizzes and lessons, just find your year group, subject and lesson and get started.",
    }}
    $background={"white"}
  >
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
