import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";
import { OakMaxWidth } from "@oaknational/oak-components";

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
import { getCombinedSubjects } from "@/pages-helpers/teacher/subject-listing-page/getCombinedSubjects";
import useAnalytics from "@/context/Analytics/useAnalytics";

export type KeyStagePageProps = {
  keyStageTitle: string;
  keyStageSlug: string;
};

export type SubjectPathway = {
  slug: string;
  data: KeyStageSubjectData;
  hasNewContent: boolean;
};

export type SubjectPathwayArray = [SubjectPathway, ...SubjectPathway[]];

export type SubjectListingPageProps = {
  subjects: [SubjectPathwayArray, ...SubjectPathwayArray[]];
  keyStageSlug: string;
  keyStageTitle: string;
  keyStages: KeyStageData[];
};

const SubjectListing: NextPage<SubjectListingPageProps> = (props) => {
  const { keyStageSlug, keyStageTitle, keyStages } = props;
  const containerHeight = keyStages.length > 4 ? 172 : 120;
  const { track } = useAnalytics();

  const metaDescriptionSlug =
    keyStageSlug === "early-years-foundation-stage"
      ? "EYFS"
      : keyStageSlug.toUpperCase();

  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Free ${metaDescriptionSlug} Teaching Resources for Lesson Planning`,
          description: `Browse and download our free ${metaDescriptionSlug} teaching resources for lesson planning. Our teaching resources are made by subject experts and entirely free to download and use.`,
        }),
      }}
      $background="white"
    >
      <Box $background={"lavender50"} $height={[containerHeight, 140]}>
        <OakMaxWidth
          $ph="inner-padding-s"
          $maxWidth={["all-spacing-21", "all-spacing-23", "all-spacing-24"]}
          $pv="inner-padding-xl2"
        >
          <KeyStageKeypad
            keyStages={keyStages}
            title="Select key stage"
            trackingOnClick={(
              filterValue: string,
              activeFilters: Record<string, string[]>,
            ) =>
              track.browseRefined({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "keystage_keypad_button",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterType: "Key stage filter",
                filterValue,
                activeFilters,
              })
            }
          />
        </OakMaxWidth>
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
      const curriculumData = await curriculumApi2023.subjectListingPage({
        keyStageSlug: keyStage,
      });

      if (!curriculumData) {
        return {
          notFound: true,
        };
      }

      const uniqueSubjectSlugs = curriculumData?.subjects
        .map((s) => s.subjectSlug)
        .filter((value, index, self) => self.indexOf(value) === index);

      const combinedAndFilteredSubjects = uniqueSubjectSlugs
        .map((subjectSlug) => {
          const combinedSubjectArray = getCombinedSubjects(
            curriculumData,
            subjectSlug,
          );

          return combinedSubjectArray?.map((combinedSubject) => ({
            slug: subjectSlug,
            data: combinedSubject,
            hasNewContent: combinedSubject.isNew,
          }));
        })
        // Filter out subjects that don't exist in either curriculum
        .filter((subjectArray) =>
          subjectArray?.map((subject) => subject.data !== null),
        )
        // sort by slug so the old and new subjects are intermingled
        .sort((a, b) => (a?.[0] && b?.[0] && a[0].slug > b[0].slug ? 1 : -1));

      const results = {
        props: {
          ...curriculumData,
          subjects: combinedAndFilteredSubjects,
        },
      };

      return results;
    },
  });
};

export default SubjectListing;
