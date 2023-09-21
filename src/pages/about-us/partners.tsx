import { NextPage, GetStaticProps } from "next";
import { FC } from "react";

import CMSClient from "../../node-lib/cms";
import { AboutPartnersPage } from "../../common-lib/cms-types";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import AboutContactCard from "../../components/AboutContactCard";
import { Heading } from "../../components/Typography";
import Flex from "../../components/Flex";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import AboutUsSummaryCard from "../../components/pages/AboutUs/AboutUsSummaryCard";
import ButtonAsLink from "../../components/Button/ButtonAsLink";
import AspectRatio from "../../components/AspectRatio";
import CMSImage from "../../components/CMSImage";
import { CMSImageProps } from "../../components/CMSImage/CMSImage";
import { SpacingProps } from "../../styles/utils/spacing";
import Illustration from "../../components/Illustration";
import { getSizes } from "../../components/CMSImage/getSizes";
import getPageProps from "../../node-lib/getPageProps";

export type AboutPageProps = {
  pageData: AboutPartnersPage;
};

const ImageContainer: FC<CMSImageProps & SpacingProps & { name: string }> = (
  props,
) => {
  return (
    <Flex $mb={32} $minWidth={"20%"}>
      <AspectRatio ratio={["3:2", "16:9"]}>
        <CMSImage
          {...props}
          width={440}
          height={220}
          noCrop
          alt={props.name}
          $objectFit="contain"
          $objectPosition={"center center"}
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
            illustration: "supporting",
            sizes: "(min-width: 750px) 720px, 100vw",
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
          $minWidth={"100%"}
          $minHeight={[160, 300]}
          $mb={48}
          $position={"relative"}
        >
          <Illustration
            sizes={getSizes([95, 178])}
            slug="teacher-carrying-more-stuff"
            $objectPosition={"center center"}
            fill
            $objectFit="contain"
          />
        </Flex>
        <ButtonAsLink
          icon={"arrow-right"}
          $iconPosition={"trailing"}
          label={"Our teachers"}
          page="our-teachers"
          $mh="auto"
          $mb={[80, 92]}
        />

        <Heading $mb={[40, 32]} $font={["heading-6", "heading-5"]} tag={"h2"}>
          Curriculum partners
        </Heading>
        <Flex $ph={[16, 0]} $flexWrap={"wrap"} $width={"100%"}>
          {pageData.curriculumPartners.map((partner) => (
            <ImageContainer $pa={[4, 16]} name={partner.name} image={partner} />
          ))}
        </Flex>
        <Heading $mb={[40, 32]} $font={["heading-6", "heading-5"]} tag={"h2"}>
          Tech partners
        </Heading>
        <Flex $ph={[16, 0]} $mb={56} $flexWrap={"wrap"} $width={"100%"}>
          {pageData.techPartners.map((partner) => (
            <ImageContainer $pa={[8, 32]} name={partner.name} image={partner} />
          ))}
        </Flex>
        <AboutContactCard {...pageData.contactSection} />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "partners::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const aboutPartnersPage = await CMSClient.aboutPartnersPage({
        previewMode: isPreviewMode,
      });

      if (!aboutPartnersPage) {
        return {
          notFound: true,
        };
      }

      const results = {
        props: {
          pageData: aboutPartnersPage,
        },
      };

      return results;
    },
  });
};

export default AboutUsPartners;
