import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import { getSeoProps } from "@//browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import SubjectListingPage from "@/components/TeacherViews/SubjectListing.view";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import Box from "@/components/SharedComponents/Box";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  KeyStageData,
  KeyStageSubjectData,
  SubjectListingPageData,
} from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import KeyStageKeypad from "@/components/SharedComponents/KeyStageKeypad";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";

export type KeyStagePageProps = {
  keyStageTitle: string;
  keyStageSlug: string;
};

export type Subjects = {
  subjectSlug: string;
  new?: KeyStageSubjectData;
  old?: KeyStageSubjectData;
}[];

export type SubjectListingPageProps = {
  subjects: Subjects;
  keyStageSlug: string;
  keyStageTitle: string;
  keyStages: KeyStageData[];
};

const SubjectListing: NextPage<SubjectListingPageProps> = (props) => {
  const { keyStageSlug, keyStageTitle, keyStages } = props;
  const containerHeight = keyStages.length > 4 ? 172 : 120;

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Free ${keyStageSlug.toUpperCase()} Teaching Resources for Lesson Planning`,
          description: `Search by subject for free ${keyStageSlug.toUpperCase()} teaching resources to download and share`,
        }),
      }}
      $background="white"
    >
      <Box $background={"lavender50"} $height={[containerHeight, 140]}>
        <MaxWidth $ph={12} $maxWidth={[480, 840, 1280]} $pv={32}>
          <KeyStageKeypad keyStages={keyStages} />
        </MaxWidth>
      </Box>
      <SubjectListingPage
        subjects={props.subjects}
        keyStageSlug={keyStageSlug}
        keyStageTitle={keyStageTitle}
        keyStages={props.keyStages}
      />
    </AppLayout>
  );
};

type URLParams = {
  keyStageSlug: string;
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
      const keyStage = context.params?.keyStageSlug;

      const isEyfs = keyStage === "early-years-foundation-stage";

      const curriculumData = await curriculumApi2023.subjectListingPage({
        keyStageSlug: keyStage,
        isLegacy: isEyfs,
      });
      const curriculumDataLegacy = await curriculumApi2023.subjectListingPage({
        keyStageSlug: keyStage,
        isLegacy: true,
      });

      if (!curriculumData || !curriculumDataLegacy) {
        return {
          notFound: true,
        };
      }

      const { keyStageSlug, keyStages } = curriculumData;
      const keyStageTitle = curriculumData.keyStageTitle;

      const subjectSlugsLegacy =
        curriculumDataLegacy?.subjects.map((s) => s.subjectSlug) || [];

      const subjectSlugs =
        curriculumData?.subjects.map((s) => s.subjectSlug) || [];

      const uniqueSubjectSlugs = [
        ...new Set(subjectSlugsLegacy.concat(subjectSlugs)),
      ];

      const getSubject = (
        data: SubjectListingPageData,
        subjectSlug: string,
        isLegacy: boolean,
      ) => {
        const slugToMatch = (subjectSlug: string) =>
          isLegacy ? removeLegacySlugSuffix(subjectSlug) : subjectSlug;

        return (
          data.subjects.find(
            (subject) => slugToMatch(subject.subjectSlug) === subjectSlug,
          ) || null
        );
      };

      const subjects = uniqueSubjectSlugs
        .map((subjectSlug) => {
          return {
            subjectSlug: subjectSlug,
            old: getSubject(curriculumDataLegacy, subjectSlug, true),
            new: isEyfs ? null : getSubject(curriculumData, subjectSlug, false),
          };
        })
        // Filter out subjects that don't exist in either curriculum
        .filter((subject) => subject.old || subject.new)
        // sort by slug so the old and new subjects are intermingled
        .sort((a, b) => (a.subjectSlug > b.subjectSlug ? 1 : -1));

      const results = {
        props: {
          keyStageSlug,
          keyStageTitle,
          subjects,
          keyStages,
        },
      };

      return results;
    },
  });
};

export default SubjectListing;
