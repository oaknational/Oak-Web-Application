import { NextPage, GetStaticProps } from "next";

import CMSClient, { AboutPage } from "../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Layout from "../components/Layout";

export type AboutPageProps = {
  pageData: AboutPage;
  isPreviewMode: boolean;
};

const About: NextPage<AboutPageProps> = ({ pageData, isPreviewMode }) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"white"}
      isPreviewMode={isPreviewMode}
    >
      <pre>{JSON.stringify(pageData, null, 2)}</pre>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const aboutPage = await CMSClient.aboutPage({
    previewMode: isPreviewMode,
  });

  return {
    props: {
      pageData: aboutPage,
      isPreviewMode,
    },
  };
};

export default About;
