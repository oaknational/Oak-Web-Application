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
} from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import KeyStageKeypad from "@/components/SharedComponents/KeyStageKeypad";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export type KeyStagePageProps = {
  keyStageTitle: string;
  keyStageSlug: string;
};

export type Subjects = {
  slug: string;
  data: KeyStageSubjectData;
  hasNewContent: boolean;
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
          <KeyStageKeypad keyStages={keyStages} title="Select key stage" />
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
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const { keyStageSlug, keyStages } = curriculumData;
      const keyStageTitle = curriculumData.keyStageTitle;

      const uniqueSubjectSlugs = curriculumData?.subjects
        .map((s) => s.subjectSlug)
        .filter((value, index, self) => self.indexOf(value) === index);

      const getCombinedSubjects = (subjectSlug: string) => {
        const subject = curriculumData.subjects.filter(
          (s) => s.subjectSlug === subjectSlug,
        );

        if (!subject || subject.length === 0) {
          return null;
        }

        const newSubject = subject.find((s) => !isSlugLegacy(s.programmeSlug));
        const legacySubject = subject.find((s) =>
          isSlugLegacy(s.programmeSlug),
        );

        const programmeCount = Math.max(
          newSubject?.programmeCount ?? 0,
          legacySubject?.programmeCount ?? 0,
        );
        const unitCount = isEyfs
          ? legacySubject!.unitCount
          : (newSubject?.unitCount ?? 0) + (legacySubject?.unitCount ?? 0);
        const lessonCount = isEyfs
          ? legacySubject!.lessonCount
          : (newSubject?.lessonCount ?? 0) + (legacySubject?.lessonCount ?? 0);

        const combinedSubject: KeyStageSubjectData & { isNew: boolean } = {
          programmeSlug:
            newSubject?.programmeSlug ?? legacySubject!.programmeSlug,
          programmeCount,
          subjectSlug: newSubject?.subjectSlug ?? legacySubject!.subjectSlug,
          subjectTitle: newSubject?.subjectTitle ?? legacySubject!.subjectTitle,
          unitCount,
          lessonCount,
          isNew: !!newSubject,
        };

        return combinedSubject;
      };

      const subjects = uniqueSubjectSlugs
        .map((subjectSlug) => {
          const combinedSubject = getCombinedSubjects(subjectSlug);
          return {
            slug: subjectSlug,
            data: combinedSubject,
            hasNewContent: combinedSubject?.isNew,
          };
        })
        // Filter out subjects that don't exist in either curriculum
        .filter((subject) => subject.data !== null)
        // sort by slug so the old and new subjects are intermingled
        .sort((a, b) => (a.slug > b.slug ? 1 : -1));

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
