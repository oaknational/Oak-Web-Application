import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";

import CMSClient, { AboutLeadershipPage } from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import AboutContactCard from "../../components/AboutContactCard";
import { Heading } from "../../components/Typography";
import AboutUsSummaryCard from "../../components/pages/AboutUs/AboutUsSummaryCard";
import BioCardList from "../../components/BioCardList";
import BioCardListItem, {
  BioCardListItemProps,
} from "../../components/BioCardList/BioCardListItem";
import Box from "../../components/Box";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";

export type AboutPageProps = {
  pageData: AboutLeadershipPage;
};

const AboutUsLeadership: NextPage<AboutPageProps> = ({ pageData }) => {
  const { seo, introPortableText, leadershipTeam } = pageData;

  const chiefExecutive: BioCardListItemProps[] = leadershipTeam.filter(
    (person) => person.role?.toLowerCase() === "chief executive"
  );
  const leaders: BioCardListItemProps[] = leadershipTeam.filter(
    (person) => person.role?.toLowerCase() !== "chief executive"
  );

  return (
    <Layout seoProps={getSeoProps(seo)} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
        <AboutUsSummaryCard {...pageData} />
        <AboutIntroCard
          image={{
            imageSrc: "/images/illustrations/work-with-us-500.png",
            alt: "illustration of four people carrying a floor, on which people are working at desks, and one person is painting at an easel",
            priority: true,
          }}
          bodyPortableText={introPortableText}
        />
        {leadershipTeam && (
          <>
            <Heading
              $mb={[40, 32]}
              $font={["heading-6", "heading-5"]}
              tag={"h2"}
            >
              Our leadership
            </Heading>
            <Box $width={["100%", "33%", "25%"]} $ph={[16, 0, 0]} $mb={32}>
              {chiefExecutive[0]?.name && (
                <BioCardListItem {...chiefExecutive[0]} />
              )}
            </Box>
            <BioCardList $mb={[80, 92]} $ph={[16, 0]} bios={leaders} />
          </>
        )}

        <AboutContactCard />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const aboutLeadershipPage = await CMSClient.aboutLeadershipPage({
    previewMode: isPreviewMode,
  });

  if (!aboutLeadershipPage) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<AboutPageProps> = {
    props: {
      pageData: aboutLeadershipPage,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default AboutUsLeadership;
