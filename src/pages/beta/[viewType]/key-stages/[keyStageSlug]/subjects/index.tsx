import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import { getSeoProps } from "../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../components/AppLayout";
import SubjectListingPage from "../../../../../../components/pages/SubjectListing.page";
import curriculumApi from "../../../../../../node-lib/curriculum-api";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../node-lib/isr";
import { ViewType } from "../../../../../../common-lib/urls";
import curriculumApi2023 from "../../../../../../node-lib/curriculum-api-2023";
import { KeyStageSubjectData } from "../../../../../../node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import getPageProps from "../../../../../../node-lib/getPageProps";

export type KeyStagePageProps = {
  keyStageTitle: string;
  keyStageSlug: string;
};
export type KeyStageSubject = [KeyStageSubjectData, ...KeyStageSubjectData[]];

export type Subjects = {
  subjectSlug: string;
  new?: KeyStageSubjectData;
  old?: KeyStageSubjectData;
}[];

export type SubjectListingPageProps = {
  subjects: Subjects;
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
      <SubjectListingPage
        subjects={props.subjects}
        keyStageSlug={keyStageSlug}
        keyStageTitle={keyStageTitle}
      />
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

      const curriculumData = await curriculumApi.subjectListing({
        keyStageSlug: context.params?.keyStageSlug,
      });

      const curriculumData2023 = await curriculumApi2023.subjectListingPage({
        keyStageSlug: context.params?.keyStageSlug,
      });

      if (!curriculumData && !curriculumData2023) {
        return {
          notFound: true,
        };
      }

      const { keyStageSlug, keyStageTitle } = curriculumData;
      const subjectSlugs = curriculumData.subjects.map((s) => s.subjectSlug);
      const subjectSlugs2023 = curriculumData2023.subjects.map(
        (s) => s.subjectSlug
      );

      const uniqueSubjectSlugs = [
        ...new Set(subjectSlugs.concat(subjectSlugs2023)),
      ];

      const subjects = uniqueSubjectSlugs.map((subjectSlug) => {
        return {
          subjectSlug,
          old:
            curriculumData.subjects.find(
              (subject) => subject.subjectSlug === subjectSlug
            ) || null,
          new:
            curriculumData2023.subjects.find(
              (subject) => subject.subjectSlug === subjectSlug
            ) || null,
        };
      });

      const results = {
        props: {
          keyStageSlug,
          keyStageTitle,
          subjects: subjects,
          subjectsUnavailable: [],
        },
      };

      return results;
    },
  });
};

export default SubjectListing;
