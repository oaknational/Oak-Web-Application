import { GetStaticProps, NextPage } from "next";

import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Layout from "../components/Layout";
import { Heading } from "../components/Typography";
import CMSClient, { SupportPage as SupportPageType } from "../node-lib/cms";

export type SupportPageProps = {
  pageData: SupportPageType;
  isPreviewMode: boolean;
};

const SupportPage: NextPage<SupportPageProps> = (props) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background="grey1"
      isPreviewMode={props.isPreviewMode}
    >
      <Heading tag="h1" $fontSize={32}></Heading>
      {JSON.stringify(props.pageData, null, 2)}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<SupportPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const supportPageResults = await CMSClient.supportPage({
    previewMode: isPreviewMode,
  });

  return {
    props: {
      pageData: supportPageResults,
      isPreviewMode,
    },
  };
};

export default SupportPage;
