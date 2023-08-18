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
import Box from "../../../../../../components/Box";
import { ViewType } from "../../../../../../common-lib/urls";
import curriculumApi2023 from "../../../../../../node-lib/curriculum-api-2023";
import {
  KeyStageSubjectData,
  SubjectListingPageData,
} from "../../../../../../node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import getPageProps from "../../../../../../node-lib/getPageProps";

import KeyStageKeypad from "@/components/KeyStageKeypad/KeyStageKeypad";

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

  /* 
  ! DEVELOPMENT ONLY - CHANGE TO FETCH FROM API
  **/
  const keyStages = [
    { slug: "ks1", title: "Key Stage 1", shortCode: "KS1" },
    { slug: "ks2", title: "Key Stage 2", shortCode: "KS2" },
    { slug: "ks3", title: "Key Stage 3", shortCode: "KS3" },
    { slug: "ks4", title: "Key Stage 4", shortCode: "KS4" },
  ];

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
      <Box $mb={40} $background={"lavender50"} $height={[120, 140]}>
        <MaxWidth $ph={12} $maxWidth={[480, 840, 1280]}>
          <Box $width={[360, 400]} $pv={32}>
            <KeyStageKeypad keyStages={keyStages} />
          </Box>
        </MaxWidth>
      </Box>
      <MaxWidth $ph={12} $maxWidth={[480, 840, 1280]}>
        <Heading tag={"h1"} $font={["heading-5", "heading-3"]}>
          {`${keyStageTitle} subjects`}
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

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
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
