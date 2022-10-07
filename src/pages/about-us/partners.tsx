import { NextPage, GetStaticProps } from "next";
import { FC } from "react";

import config from "../../config";
import CMSClient, { AboutPartnersPage } from "../../node-lib/cms";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import AboutContactCard from "../../components/AboutContactCard";
import { Heading } from "../../components/Typography";
import Flex from "../../components/Flex";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import AboutUsSummaryCard from "../../components/pages/AboutUs/AboutUsSummaryCard";
import CardImage from "../../components/Card/CardComponents/CardImage";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import AspectRatio from "../../components/AspectRatio";
import CMSImage from "../../components/CMSImage";
import { CMSImageProps } from "../../components/CMSImage/CMSImage";
import { SpacingProps } from "../../styles/utils/spacing";

export type AboutPageProps = {
  pageData: AboutPartnersPage;
};

const ImageContainer: FC<CMSImageProps & SpacingProps> = (props) => {
  return (
    <Flex $mb={32} $minWidth={"20%"}>
      <AspectRatio ratio={["3:2", "16:9"]}>
        <CMSImage
          {...props}
          $objectFit="contain"
          $objectPosition={"center center"}
          fill
        />
      </AspectRatio>
    </Flex>
  );
};

const AboutUsPartners: NextPage<AboutPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
        <AboutUsSummaryCard {...pageData} />
        <AboutIntroCard
          image={{
            imageSrc: "/images/illustrations/work-with-us-500.png",
            alt: "illustration of four people carrying a floor, on which people are working at desks, and one person is painting at an easel",
            priority: true,
          }}
          bodyPortableText={pageData.introPortableText}
        />

        <Heading $mb={[40, 32]} $font={["heading-6", "heading-5"]} tag={"h2"}>
          Meet our teachers
        </Heading>
        <Flex
          $alignItems={"center"}
          $justifyContent={"center"}
          $minWidth={"50%"}
          $pb={[48, 0]}
          $mb={[48]}
        >
          <CardImage
            alt={"curriculum design illustration"}
            imageSrc={"/images/illustrations/teacher-carrying-more-stuff.png"}
            position={"center center"}
          />
        </Flex>
        <ButtonAsLink
          icon={"ArrowRight"}
          iconPosition={"trailing"}
          label={"Our teachers"}
          href={"https://classroom.thenational.academy/teachers"}
          $mb={[80, 92]}
        />

        <Heading $mb={[40, 32]} $font={["heading-6", "heading-5"]} tag={"h2"}>
          Curriculum partners
        </Heading>
        <Flex $ph={[16, 0]} $flexWrap={"wrap"} $width={"100%"}>
          {pageData.curriculumPartners.map((partner) => (
            <ImageContainer $pa={[4, 16]} image={partner} />
          ))}
        </Flex>
        <Heading $mb={[40, 32]} $font={["heading-6", "heading-5"]} tag={"h2"}>
          Tech partners
        </Heading>
        <Flex $ph={[16, 0]} $mb={56} $flexWrap={"wrap"} $width={"100%"}>
          {pageData.techPartners.map((partner) => (
            <ImageContainer $pa={[8, 32]} image={partner} />
          ))}
        </Flex>
        <AboutContactCard />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const aboutPartnersPage = await CMSClient.aboutPartnersPage({
    previewMode: isPreviewMode,
  });

  if (!aboutPartnersPage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: aboutPartnersPage,
    },
    revalidate: config.get("sanityRevalidateSeconds"),
  };
};

export default AboutUsPartners;
