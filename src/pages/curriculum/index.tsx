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
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

const fetchSubjectPhasePickerData: () => Promise<SubjectPhasePickerData> =
  async () => {
    const subjects = await curriculumApi2023.curriculumPhaseOptions();
    return {
      subjects: filterValidCurriculumPhaseOptions(subjects),
    };
  };

const Curriculum: NextPage<
  HomePageProps & { curriculumPhaseOptions: SubjectPhasePickerData }
> = (props) => {
  const testimonials = props.pageData?.testimonials;
  const intro = props.pageData?.intro;

  return (
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
      <CurriculumTab
        aria-current="page"
        curriculumPhaseOptions={props.curriculumPhaseOptions}
      />
      <HomePageLowerView
        posts={props.posts}
        testimonials={testimonials}
        introVideo={intro}
      />
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<HomePageProps> = async (
  context,
) => {
  const curriculumPhaseOptions = await fetchSubjectPhasePickerData();
  const data = await getPageProps({
    page: "curriculum-home-page::getStaticProps",
    context,
    getProps: getPropsFunction(context),
  });
  return {
    ...data,
    props: {
      // @ts-expect-error: 'props' exists on data, but typescript doesn't know about it.
      ...data.props,
      curriculumPhaseOptions,
    },
  };
};

export default Curriculum;
