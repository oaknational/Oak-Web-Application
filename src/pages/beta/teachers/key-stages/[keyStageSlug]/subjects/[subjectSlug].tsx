import React from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import TierList from "../../../../../../components/TierList";
import { getSeoProps } from "../../../../../../browser-lib/seo/getSeoProps";
import AppLayout from "../../../../../../components/AppLayout";
import SubjectErrorCard from "../../../../../../components/Card/SubjectErrorCard";
import TitleCard from "../../../../../../components/Card/TitleCard";
import Flex from "../../../../../../components/Flex";
import MaxWidth from "../../../../../../components/MaxWidth/MaxWidth";
import curriculumApi, {
  TeachersKeyStageSubjectTiersData,
} from "../../../../../../node-lib/curriculum-api";
import { decorateWithIsr } from "../../../../../../node-lib/isr";

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
        title: "Units", // @todo add real data
        description: "Subject units",
      })}
    >
      <MaxWidth $ph={16}>
        <Flex $mt={24} $mb={32}>
          <SubjectErrorCard
            buttonProps={{
              label: "Find out why",
              page: null,
              href: "/",
            }}
            headingTag={"h3"}
            heading={"Some subjects unavailable"}
            text={"Unfortunately some subjects are now unavailable."}
          />
        </Flex>
        <Flex $mb={24} $display={"inline-flex"}>
          <TitleCard
            page={"subject"}
            keyStage={keyStageTitle}
            keyStageSlug={keyStageSlug}
            title={subjectTitle}
            iconName={"Rocket"}
          />
        </Flex>
        <TierList
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

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const keyStageSubjectPairs =
    await curriculumApi.teachersKeyStageSubjectTiersPaths();
  const paths = keyStageSubjectPairs.map(({ subjectSlug, keyStageSlug }) => ({
    params: {
      subjectSlug,
      keyStageSlug,
    },
  }));

  return {
    fallback: false,
    paths,
  };
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
