import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import { getSeoProps } from "@//browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import SubjectListingPage from "@/components/TeacherViews/SubjectListing.view";
import curriculumApi from "@/node-lib/curriculum-api";
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
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Free ${keyStageSlug.toUpperCase()} Teaching Resources for Lesson Planning`,
          description: "Key stage by subject",
        }),
        ...{ noFollow: false, noIndex: false },
      }}
      $background="white"
    >
      <Box $background={"lavender50"} $height={[120, 140]}>
        <MaxWidth $ph={12} $maxWidth={[480, 840, 1280]}>
          <Box $pv={32}>
            <KeyStageKeypad keyStages={keyStages} />
          </Box>
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
      const keystage = context.params?.keyStageSlug;
      const isEyfs = keystage === "early-years-foundation-stage";

      const curriculumData2023 = await curriculumApi2023.subjectListingPage({
        keyStageSlug: keystage,
        isLegacy: isEyfs,
      });

      const { keyStageSlug, keyStages } = curriculumData2023;
      let keyStageTitle = curriculumData2023.keyStageTitle;

      const subjectSlugs2023 =
        curriculumData2023?.subjects.map((s) => s.subjectSlug) || [];

      let subjects = [];

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

      // EYFS only exists in the new API
      if (isEyfs) {
        if (!curriculumData2023) {
          return {
            notFound: true,
          };
        }

        subjects = subjectSlugs2023.map((subjectSlug) => {
          return {
            subjectSlug,
            old: getSubject(curriculumData2023, subjectSlug, false),
            new: null,
          };
        });
      } else {
        const curriculumData = await curriculumApi.subjectListing({
          keyStageSlug: keystage,
        });

        if (!curriculumData && !curriculumData2023) {
          return {
            notFound: true,
          };
        }

        keyStageTitle = curriculumData.keyStageTitle;

        const subjectSlugs = curriculumData.subjects.map((s) =>
          removeLegacySlugSuffix(s.subjectSlug),
        );

        const uniqueSubjectSlugs = [
          ...new Set(subjectSlugs.concat(subjectSlugs2023)),
        ];

        subjects = uniqueSubjectSlugs
          .map((subjectSlug) => {
            return {
              subjectSlug,
              old: getSubject(curriculumData, subjectSlug, true),
              new: getSubject(curriculumData2023, subjectSlug, false),
            };
          })
          // Filter out subjects that don't exist in either curriculum
          .filter((subject) => subject.old || subject.new)
          // sort by slug so the old and new subjects are intermingled
          .sort((a, b) => (a.subjectSlug > b.subjectSlug ? 1 : -1));
      }

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
