import React from "react";
import { GetStaticPathsResult, GetStaticProps, NextPage } from "next";

import curriculumApi from "@/node-lib/curriculum-api";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/AppLayout/AppLayout";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import SubjectTierListing from "@/components/SubjectProgrammeListing/SubjectProgrammeListing";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";
import HeaderListing from "@/components/HeaderListing/HeaderListing";
import isProgrammeSlugLegacy from "@/utils/slugModifiers/isProgrammeSlugLegacy";

const ProgrammesListingPage: NextPage<ProgrammeListingPageData> = (props) => {
  const { programmes, keyStageSlug, subjectSlug, keyStageTitle, subjectTitle } =
    props;

  if (!programmes[0]) {
    throw new Error("No programmes");
  }

  const tiersSEO = {
    ...getSeoProps({
      title: `${keyStageTitle} ${subjectTitle} tiers`,
      description: `We have resources for tiers: ${programmes
        .filter((programme) => programme.tierTitle)
        .map((programme) => programme.tierTitle)
        .join(", ")}`,
    }),
    ...{ noFollow: true, noIndex: true },
  };
  return (
    <AppLayout seoProps={tiersSEO}>
      <HeaderListing
        breadcrumbs={[
          {
            oakLinkProps: { page: "home" },
            label: "Home",
          },
          {
            oakLinkProps: {
              page: "subject-index",
              keyStageSlug,
            },
            label: keyStageTitle ?? "",
          },
          {
            oakLinkProps: {
              page: "programme-index",
              subjectSlug,
              keyStageSlug,
            },
            label: subjectTitle,
          },
        ]}
        background={"lavender30"}
        subjectIconBackgroundColor={"lavender"}
        title={subjectTitle}
        programmeFactor={keyStageTitle}
        {...props}
      />
      <MaxWidth $mt={[56, 72]} $ph={16}>
        <SubjectTierListing {...props} />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  keyStageSlug: string;
  subjectSlug: string;
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
  ProgrammeListingPageData,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "teachers-programme-listing::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("No context params");
      }

      const curriculumData = isProgrammeSlugLegacy(context.params?.subjectSlug)
        ? await curriculumApi2023.programmeListingPage({
            keyStageSlug: context.params?.keyStageSlug,
            subjectSlug: context.params?.subjectSlug,
          })
        : await curriculumApi.tierListing({
            keyStageSlug: context.params?.keyStageSlug,
            subjectSlug: context.params?.subjectSlug,
          });

      const results = {
        props: {
          ...curriculumData,
        },
      };

      return results;
    },
  });
};

export default ProgrammesListingPage;
