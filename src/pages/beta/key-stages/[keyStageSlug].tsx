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
import Box from "../../../components/Box";
import { decorateWithIsr } from "../../../node-lib/isr";

export type KeyStageProps = {
  keyStageData: { data: string | undefined };
};

const KeyStageListPage: NextPage<KeyStageProps> = (props) => {
  return (
    <Layout
      seoProps={getSeoProps({
        title: "add real data", // @todo add real data
        description: "add readl data",
      })}
      $background="white"
    >
      <Box>Key stage {props.keyStageData.data}</Box>
      {/* <BlogJsonLd blog={props.blog} /> */}
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
  const keyStageData = { data: context.params?.keyStageSlug };

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
