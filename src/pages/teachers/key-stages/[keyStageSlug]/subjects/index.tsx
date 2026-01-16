import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";
import { OakBox, OakMaxWidth } from "@oaknational/oak-components";

import { getSeoProps } from "@//browser-lib/seo/getSeoProps";
import AppLayout from "@/components/SharedComponents/AppLayout";
import SubjectListingPage from "@/components/TeacherViews/SubjectListing.view";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import {
  KeyStageData,
  KeyStageSubjectData,
} from "@/node-lib/curriculum-api-2023/queries/subjectListing/subjectListing.schema";
import getPageProps from "@/node-lib/getPageProps";
import KeyStageKeypad from "@/components/SharedComponents/KeyStageKeypad";
import { getCombinedSubjects } from "@/pages-helpers/teacher/subject-listing-page/getCombinedSubjects";
import useAnalytics from "@/context/Analytics/useAnalytics";
import Banners from "@/components/SharedComponents/Banners";
import { KeyStageSlug } from "@/utils/curriculum/types";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

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
  keyStageSlug: KeyStageSlug | "early-years-foundation-stage";
  keyStageTitle: string;
  keyStages: KeyStageData[];
  topNav: TopNavProps;
};

const SubjectListing: NextPage<SubjectListingPageProps> = (props) => {
  const { keyStageSlug, keyStageTitle, keyStages, topNav } = props;
  const { track } = useAnalytics();

  const metaDescriptionSlug =
    keyStageSlug === "early-years-foundation-stage"
      ? "EYFS"
      : keyStageSlug.toUpperCase();

  return (
    <AppLayout
      topNavProps={topNav}
      seoProps={{
        ...getSeoProps({
          title: `Free ${metaDescriptionSlug} Teaching Resources for Lesson Planning`,
          description: `Browse and download our free ${metaDescriptionSlug} teaching resources for lesson planning. Our teaching resources are made by subject experts and entirely free to download and use.`,
        }),
      }}
      $background="bg-primary"
    >
      <Banners />
      <OakBox $background={"bg-decorative3-subdued"}>
        <OakMaxWidth
          $ph="spacing-12"
          $maxWidth={["spacing-480", "spacing-960", "spacing-1280"]}
          $pv="spacing-32"
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
      </OakBox>
      <SubjectListingPage
        subjects={props.subjects}
        keyStageSlug={keyStageSlug}
        keyStageTitle={keyStageTitle}
        keyStages={props.keyStages}
        topNav={topNav}
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

      const topNav = await curriculumApi2023.topNav();

      const results = {
        props: {
          ...curriculumData,
          subjects: combinedAndFilteredSubjects,
          topNav,
        },
      };

      return results;
    },
  });
};

export default SubjectListing;
