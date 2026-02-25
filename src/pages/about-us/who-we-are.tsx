import { NextPage, GetServerSideProps } from "next";

import CMSClient from "@/node-lib/cms";
import { NewAboutWhoWeArePage } from "@/common-lib/cms-types";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { WhoAreWeBreakout } from "@/components/GenericPagesComponents/WhoAreWeBreakout";
import WhoAreWeTimeline from "@/components/GenericPagesComponents/WhoAreWeTimeline";
import { WhoAreWeDesc } from "@/components/GenericPagesComponents/WhoAreWeDesc";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/Layout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

export type AboutPageProps = {
  pageData: NewAboutWhoWeArePage;
  topNav: TopNavProps;
};

export const AboutWhoWeAreNew: NextPage<AboutPageProps> = ({
  pageData,
  topNav,
}) => {
  return (
    <Layout
      seoProps={getSeoProps({ title: "Oak's Curricula" })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={"About Oak"}
          content={pageData.header.subTitle}
        >
          <AboutSharedHeaderImage
            imageAlt=""
            imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1734018530/OWA/illustrations/auth-acorn_zyoma2.svg"
          />
        </AboutSharedHeader>
        <WhoAreWeBreakout
          image={pageData.breakout.image}
          content={pageData.breakout.text}
        />
        <WhoAreWeTimeline
          title={"As teaching evolves, so do we..."}
          subTitle={"Oak’s story"}
          items={pageData.timeline}
        />
        <WhoAreWeDesc title={"We are..."} items={pageData.usp} />
      </AboutUsLayout>
    </Layout>
  );
};

function AboutWhoWeAre(props: Readonly<AboutPageProps>) {
  return <AboutWhoWeAreNew {...props} />;
}

export const getServerSideProps = (async (context) => {
  const isPreviewMode = context.preview === true;

  const pageData = await CMSClient.newAboutWhoWeArePage({
    previewMode: isPreviewMode,
  });

  if (!pageData) {
    return {
      notFound: true,
    };
  }

  const topNav = await curriculumApi2023.topNav();

  return {
    props: {
      pageData,
      topNav,
    },
  };
}) satisfies GetServerSideProps<AboutPageProps>;

export default AboutWhoWeAre;
