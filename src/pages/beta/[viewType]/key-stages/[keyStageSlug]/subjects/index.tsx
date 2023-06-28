import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";
import { groupBy } from "lodash";

import { getSeoProps } from "../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../components/AppLayout";
import MaxWidth from "../../../../../../components/MaxWidth/MaxWidth";
import SubjectListingPage from "../../../../../../components/pages/SubjectListing.page";
import { Heading } from "../../../../../../components/Typography";
import curriculumApi from "../../../../../../node-lib/curriculum-api";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../node-lib/isr";
import Breadcrumbs from "../../../../../../components/Breadcrumbs";
import Box from "../../../../../../components/Box";
import { VIEW_TYPES, ViewType } from "../../../../../../common-lib/urls";
import curriculumApi2023 from "../../../../../../node-lib/curriculum-api-2023";
import {
  KeyStageSubjectData,
  SubjectListingPageData,
} from "../../../../../../node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import getPageProps from "../../../../../../node-lib/getPageProps";

export type KeyStagePageProps = {
  keyStageTitle: string;
  keyStageSlug: string;
};
export type KeyStageSubject = [KeyStageSubjectData, ...KeyStageSubjectData[]];

export type SubjectListingPageProps = {
  subjects: KeyStageSubject[];
  subjectsUnavailable: KeyStageSubject[];
  keyStageSlug: string;
  keyStageTitle: string;
};

const SubjectListing: NextPage<SubjectListingPageProps> = (props) => {
  const { keyStageSlug, keyStageTitle } = props;
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Free ${keyStageSlug.toUpperCase()} Teaching Resources for Lesson Planning`,
          description: "Key stage by subject",
        }),
        ...{ noFollow: true, noIndex: true },
      }}
      $background="white"
    >
      <MaxWidth $ph={12} $maxWidth={[480, 840, 1280]}>
        <Box $mv={[24, 48]}>
          <Breadcrumbs
            breadcrumbs={[
              {
                oakLinkProps: { page: "home", viewType: "teachers" },
                label: "Home",
              },
              {
                oakLinkProps: {
                  page: "subject-index",
                  viewType: "teachers",
                  keyStageSlug,
                },
                label: keyStageTitle,
                disabled: true,
              },
            ]}
          />
        </Box>
        <Heading tag={"h1"} $font={"heading-4"}>
          {keyStageTitle}
        </Heading>
      </MaxWidth>
      <SubjectListingPage {...props} />
    </AppLayout>
  );
};

type URLParams = {
  keyStageSlug: string;
  viewType: ViewType;
};

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

  const paths = VIEW_TYPES.flatMap((viewType) =>
    keyStages.map((keyStage) => ({
      params: { viewType, keyStageSlug: keyStage.slug },
    }))
  );

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
  return getPageProps({
    page: "teachers-subject-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params?.keyStageSlug) {
        throw new Error("No keyStageSlug");
      }

      const curriculumData =
        context?.params?.viewType === "teachers-2023"
          ? await curriculumApi2023.subjectListingPage({
              keyStageSlug: context.params?.keyStageSlug,
            })
          : await curriculumApi.subjectListing({
              keyStageSlug: context.params?.keyStageSlug,
            });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const { subjects, subjectsUnavailable, keyStageSlug, keyStageTitle } =
        curriculumData;

      const keyStageSubjectAvailable = Object.values(
        groupBy(
          subjects,
          (subject: SubjectListingPageData["subjects"][number]) =>
            subject.subjectSlug
        )
      );
      const keyStageSubjectUnavailable = Object.values(
        groupBy(
          subjectsUnavailable,
          (subject: SubjectListingPageData["subjects"][number]) =>
            subject.subjectSlug
        )
      );

      const results = {
        props: {
          keyStageSlug,
          keyStageTitle,
          subjects: keyStageSubjectAvailable,
          subjectsUnavailable: keyStageSubjectUnavailable,
        },
      };

      return results;
    },
  });
};

export default SubjectListing;
