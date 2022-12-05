import React from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import keyStagesKeypad from "../../../browser-lib/fixtures/keyStagesKeypad";
import AppLayout from "../../../components/AppLayout";
import { getSeoProps } from "../../../browser-lib/seo/getSeoProps";
import { decorateWithIsr } from "../../../node-lib/isr";
import { Heading } from "../../../components/Typography";
import {
  unavailableSubjectListData,
  subjectListData,
} from "../../../browser-lib/fixtures/subjectListing";
import { SubjectCardLinkProps } from "../../../components/Card/SubjectCardLink";
import SubjectListingPage from "../../../components/pages/SubjectListing";
import MaxWidth from "../../../components/MaxWidth/MaxWidth";

export type KeyStageProps = {
  keyStageData: {
    url: string | undefined;
    subjectListData: SubjectCardLinkProps[];
    unavailableSubjectListData: SubjectCardLinkProps[];
  };
};

const KeyStageListPage: NextPage<KeyStageProps> = (props) => {
  return (
    <AppLayout
      seoProps={getSeoProps({
        title: "Key stage", // @todo add real data
        description: "Key stage by subject",
      })}
      $background="white"
    >
      {props.keyStageData.url && (
        <MaxWidth $ph={12} $pt={48} $maxWidth={[480, 840, 1280]}>
          <Heading tag={"h1"} $font={"heading-4"}>
            Key stage{" "}
            {props.keyStageData.url[props.keyStageData.url.length - 1]}
          </Heading>{" "}
        </MaxWidth>
      )}
      <SubjectListingPage {...props} />
    </AppLayout>
  );
};

type URLParams = { keyStageSlug: string };

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const keyStages = keyStagesKeypad.keyStages;

  const paths = keyStages.map((keyStage) => ({
    params: { keyStageSlug: keyStage.slug },
  }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<KeyStageProps, URLParams> = async (
  context
) => {
  const keyStageData = {
    url: context.params?.keyStageSlug,
    subjectListData,
    unavailableSubjectListData,
  };

  if (!keyStageData) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<KeyStageProps> = {
    props: {
      keyStageData,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default KeyStageListPage;
