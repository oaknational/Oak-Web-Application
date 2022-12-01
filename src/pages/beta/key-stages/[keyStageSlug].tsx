import React from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import keyStagesKeypad from "../../../browser-lib/fixtures/keyStagesKeypad";
import Layout from "../../../components/Layout";
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
import Breadcrumbs from "../../../components/Breadcrumbs";
import Flex from "../../../components/Flex";

export type KeyStageProps = {
  keyStageData: {
    url: string | undefined;
    subjectListData: SubjectCardLinkProps[];
    unavailableSubjectListData: SubjectCardLinkProps[];
  };
};

const KeyStageListPage: NextPage<KeyStageProps> = (props) => {
  return (
    <Layout
      seoProps={getSeoProps({
        title: "Key stage", // @todo add real data
        description: "Key stage by subject",
      })}
      $background="white"
    >
      <MaxWidth>
        <Flex $pv={48}>
          {" "}
          <Breadcrumbs
            breadcrumbs={[
              { href: "/beta/teachers", label: "Home" },
              {
                href: `/beta/key-stages/${props.keyStageData.url}`,
                label: `${props.keyStageData.url?.split("-").join(" ")}`,
              },
            ]}
          />
        </Flex>
      </MaxWidth>

      {props.keyStageData.url && (
        <MaxWidth $ph={[0, 12]}>
          <Heading tag={"h1"} $font={"heading-4"}>
            Key stage{" "}
            {props.keyStageData.url[props.keyStageData.url.length - 1]}
          </Heading>{" "}
        </MaxWidth>
      )}

      <SubjectListingPage {...props} />
    </Layout>
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
