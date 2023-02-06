import React from "react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { getSeoProps } from "../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../components/AppLayout";
import MaxWidth from "../../../../../../components/MaxWidth/MaxWidth";
import SubjectListingPage from "../../../../../../components/pages/SubjectListing.page";
import { Heading } from "../../../../../../components/Typography";
import curriculumApi, {
  TeachersKeyStageSubjectsData,
} from "../../../../../../node-lib/curriculum-api";
import { decorateWithIsr } from "../../../../../../node-lib/isr";

export type KeyStagePageProps = {
  curriculumData: TeachersKeyStageSubjectsData;
};

const KeyStageListPage: NextPage<KeyStagePageProps> = (props) => {
  const { curriculumData } = props;
  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Key stage", // @todo add real data
        description: "Key stage by subject",
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

type URLParams = { keyStageSlug: string };

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  /**
   * @todo this should probably be a new query called 'teachersKeyStageSubjectsPaths',
   * although there's a trade off between having well named and specific queries for
   * each concern, and ensuring that linked data integrity is intact.
   *
   * E.g. on the home page, we fetch a list of key stages (each which links to an
   * instance of this page). The 'paths' query for this page must align exactly with
   * the key stages returned by the 'props' query in the home page. My current
   * thinking is that they should be separate queries but there should be tests to
   * ensure alignment.
   */
  const { keyStages } = await curriculumApi.teachersHomePage();

  const paths = keyStages.map((keyStage) => ({
    params: { keyStageSlug: keyStage.slug },
  }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<
  KeyStagePageProps,
  URLParams
> = async (context) => {
  if (!context.params?.keyStageSlug) {
    throw new Error("No keyStageSlug");
  }

  const curriculumData = await curriculumApi.teachersKeyStageSubjects({
    keyStageSlug: context.params?.keyStageSlug,
  });

  const results = {
    props: {
      curriculumData,
    },
  };

  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default KeyStageListPage;
