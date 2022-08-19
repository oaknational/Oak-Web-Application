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
          heading={pageData.workWithUs.sectionHeading}
          summary={pageData.workWithUs.introPortableText}
          background={"teachersPastelYellow"}
        >
          <ButtonLinkNav
            $mt={36}
            buttons={[
              { label: "who we are", href: "/", selected: false },
              { label: "leadership", href: "/", selected: false },
              { label: "board", href: "/", selected: false },
              { label: "partners", href: "/", selected: false },
              { label: "work with us", href: "/", selected: true },
            ]}
          />
        </SummaryCard>
        <Card $mv={[0, 92]} $background={"twilight"}>
          <PortableText value={pageData.workWithUs.introPortableText} />
        </Card>

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
