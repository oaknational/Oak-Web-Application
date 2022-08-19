import { NextPage, GetStaticProps } from "next";
import { PortableText } from "@portabletext/react";

import CMSClient, { AboutPage } from "../../node-lib/cms";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import SummaryCard from "../../components/Card/SummaryCard";
import ButtonLinkNav from "../../components/ButtonLinkNav/ButtonLinkNav";
import Card from "../../components/Card";
import AboutContactCard from "../../components/AboutContactCard";
import { Heading } from "../../components/Typography";

export type AboutPageProps = {
  pageData: AboutPage;
  isPreviewMode: boolean;
};

const AboutUsBoard: NextPage<AboutPageProps> = ({
  pageData,
  isPreviewMode,
}) => {
  console.log(pageData);
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"white"}
      isPreviewMode={isPreviewMode}
    >
      <MaxWidth $pt={[64, 80]}>
        <SummaryCard
          title={"about us"}
          heading={pageData.board.sectionHeading}
          summary={pageData.board.introPortableText}
          background={"teachersPastelYellow"}
        >
          <ButtonLinkNav
            $mt={36}
            buttons={[
              { label: "who we are", href: "/", selected: false },
              { label: "leadership", href: "/", selected: false },
              { label: "board", href: "/", selected: true },
              { label: "partners", href: "/", selected: false },
              { label: "work with us", href: "/", selected: false },
            ]}
          />
        </SummaryCard>
        <Card $mv={[0, 92]} $background={"twilight"}>
          <PortableText value={pageData.board.introPortableText} />
        </Card>
        <Heading $mb={[0, 32]} $fontSize={[20, 24]} tag={"h3"}>
          {pageData.board.sectionHeading}
        </Heading>

        <AboutContactCard />
      </MaxWidth>
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
    revalidate: 10,
  };
};

export default AboutUsBoard;
