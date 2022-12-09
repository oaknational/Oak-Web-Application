import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { getSeoProps } from "../../../../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../../../../components/AppLayout";
import MaxWidth from "../../../../../../../../../components/MaxWidth/MaxWidth";
import SubjectListingPage from "../../../../../../../../../components/pages/SubjectListing";
import { Heading } from "../../../../../../../../../components/Typography";
import curriculumApi, {
  TeachersKeyStageSubjectsData,
} from "../../../../../../../../../node-lib/curriculum-api";
import { decorateWithIsr } from "../../../../../../../../../node-lib/isr";

type LessonListPageProps = {
  curriculumData: TeachersKeyStageSubjectsData;
};

const LessonListPage: NextPage<LessonListPageProps> = (props) => {
  const { curriculumData } = props;
  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Lesson Listing", // @todo add real data
        description: "Lessons in Unit",
      })}
      $background="white"
    >
      <MaxWidth $ph={12} $pt={48} $maxWidth={[480, 840, 1280]}>
        <Heading tag={"h1"} $font={"heading-4"}>
          {curriculumData.keyStageTitle}
        </Heading>
      </MaxWidth>
      <SubjectListingPage subjects={curriculumData.subjects} />
    </AppLayout>
  );
};

type URLParams = { unitSlug: string };

// export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
//   const { keyStages } = await curriculumApi.teachersHomePage();

//   const paths = keyStages.map((keyStage) => ({
//     params: { keyStageSlug: keyStage.slug },
//   }));

//   return {
//     fallback: false,
//     paths,
//   };
// };

// export const getStaticProps: GetStaticProps<
//   LessonListPageProps,
//   URLParams
// > = async (context) => {
//   if (!context.params?.keyStageSlug) {
//     throw new Error("No keyStageSlug");
//   }

//   const curriculumData = await curriculumApi.teachersKeyStageSubjects({
//     unitSlug: context.params?.unitSlug,
//   });

//   const results = {
//     props: {
//       curriculumData,
//     },
//   };

//   const resultsWithIsr = decorateWithIsr(results);
//   return resultsWithIsr;
// };

export default LessonListPage;
