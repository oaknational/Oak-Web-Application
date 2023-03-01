import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import { getSeoProps } from "../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../components/AppLayout";
import MaxWidth from "../../../../../../components/MaxWidth/MaxWidth";
import SubjectListingPage from "../../../../../../components/pages/SubjectListing.page";
import { Heading } from "../../../../../../components/Typography";
import curriculumApi, {
  TeachersKeyStageSubjectsData,
} from "../../../../../../node-lib/curriculum-api";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../node-lib/isr";
import Breadcrumbs from "../../../../../../components/Breadcrumbs";
import Box from "../../../../../../components/Box";

export type KeyStagePageProps = {
  curriculumData: TeachersKeyStageSubjectsData;
};

const KeyStageListPage: NextPage<KeyStagePageProps> = (props) => {
  const { curriculumData } = props;
  const { keyStageSlug, keyStageTitle } = curriculumData;
  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Key stage", // @todo add real data
        description: "Key stage by subject",
      })}
      $background="white"
    >
      <MaxWidth $ph={12} $maxWidth={[480, 840, 1280]}>
        <Box $mv={[24, 48]}>
          {" "}
          <Breadcrumbs
            breadcrumbs={[
              { href: "/beta/teachers/", label: "Home" },
              {
                href: `/beta/teachers/key-stages/${keyStageSlug}/subjects`,
                label: keyStageTitle,
                disabled: true,
              },
            ]}
          />
        </Box>

        <Heading tag={"h1"} $font={"heading-4"}>
          {curriculumData.keyStageTitle}
        </Heading>
      </MaxWidth>
      <SubjectListingPage subjects={curriculumData.subjects} />
    </AppLayout>
  );
};

type URLParams = { keyStageSlug: string };

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

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

  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
  };
  return config;
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
