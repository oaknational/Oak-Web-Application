import React from "react";
import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import TierList from "../../../../../../components/TierList";
import { getSeoProps } from "../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../components/AppLayout";
import TitleCard from "../../../../../../components/Card/TitleCard";
import MaxWidth from "../../../../../../components/MaxWidth/MaxWidth";
import curriculumApi, {
  TeachersKeyStageSubjectTiersData,
} from "../../../../../../node-lib/curriculum-api";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../../../../../node-lib/isr";
import { Heading } from "../../../../../../components/Typography";

type SubjectTierListingPageProps = {
  curriculumData: TeachersKeyStageSubjectTiersData;
};

const SubjectTierListingPage: NextPage<SubjectTierListingPageProps> = ({
  curriculumData,
}) => {
  const { keyStageTitle, keyStageSlug, subjectTitle, subjectSlug, tiers } =
    curriculumData;

  return (
    <AppLayout
      seoProps={getSeoProps({
        title: `${keyStageTitle} ${subjectTitle} tiers`, // @todo add real data
        description: `We have resources for tiers: ${tiers
          .map((tier) => tier.title)
          .join(", ")}`,
      })}
    >
      <MaxWidth $ph={16}>
        <TitleCard
          page={"subject"}
          keyStage={keyStageTitle}
          keyStageSlug={keyStageSlug}
          title={subjectTitle}
          iconName={"Rocket"}
          $mt={48}
          $mb={64}
          $alignSelf={"flex-start"}
        />
        <Heading tag="h2" $font="heading-5" $mb={30}>
          Learning tiers
        </Heading>
        <TierList
          $mb={92}
          tiers={tiers}
          keyStageSlug={keyStageSlug}
          subjectSlug={subjectSlug}
        />
      </MaxWidth>
    </AppLayout>
  );
};

export type URLParams = {
  subjectSlug: string;
  keyStageSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const keyStageSubjectPairs =
    await curriculumApi.teachersKeyStageSubjectTiersPaths();
  const paths = keyStageSubjectPairs.tiers.map(
    ({ subjectSlug, keyStageSlug }) => ({
      params: {
        subjectSlug,
        keyStageSlug,
      },
    })
  );

  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  SubjectTierListingPageProps,
  URLParams
> = async (context) => {
  if (!context.params) {
    throw new Error("No context.params");
  }
  const { subjectSlug, keyStageSlug } = context.params;
  const curriculumData = await curriculumApi.teachersKeyStageSubjectTiers({
    subjectSlug,
    keyStageSlug,
  });

  const results: GetStaticPropsResult<SubjectTierListingPageProps> = {
    props: {
      curriculumData,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default SubjectTierListingPage;
