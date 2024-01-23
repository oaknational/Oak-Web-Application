import { NextPage, GetStaticProps } from "next";
import { FC } from "react";
import { OakFlex } from "@oak-academy/oak-components";

import CMSClient from "@/node-lib/cms";
import { AboutPartnersPage } from "@/common-lib/cms-types";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import GenericIntroCard from "@/components/GenericPagesComponents/GenericIntroCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import getPageProps from "@/node-lib/getPageProps";
import { SpacingProps } from "@/styles/utils/spacing";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Layout from "@/components/AppComponents/Layout";
import Illustration from "@/components/SharedComponents/Illustration";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";
import AspectRatio from "@/components/SharedComponents/AspectRatio";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { Heading, LI } from "@/components/SharedComponents/Typography";
import { FlexList } from "@/components/SharedComponents/Typography/UL";

export type AboutPageProps = {
  pageData: AboutPartnersPage;
};

const ImageContainer: FC<CMSImageProps & SpacingProps & { name: string }> = (
  props,
) => {
  return (
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
  );
};

const AboutUsPartners: NextPage<AboutPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <MaxWidth $mb={[56, 80]} $pt={[64, 80]}>
        <GenericSummaryCard {...pageData} />
        <GenericIntroCard
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
        <OakFlex
          $alignItems={"center"}
          $justifyContent={"center"}
          $minWidth={"100%"}
          $minHeight={["all-spacing-17", "all-spacing-19"]}
          $mb={"space-between-l"}
          $position={"relative"}
        >
          <Illustration
            sizes={getSizes([95, 178])}
            slug="teacher-carrying-more-stuff"
            $objectPosition={"center center"}
            fill
            $objectFit="contain"
          />
        </OakFlex>
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
        <FlexList $ph={[16, 0]} $flexWrap={"wrap"} $width={"100%"}>
          {pageData.curriculumPartners.map((partner) => (
            <LI
              $mb={32}
              $minWidth={"20%"}
              listStyle="none"
              key={`curriculum-partners-${partner.name}`}
            >
              <ImageContainer
                name={partner.name}
                image={partner}
                $pa={[4, 16]}
              />
            </LI>
          ))}
        </FlexList>
        <Heading $mb={[40, 32]} $font={["heading-6", "heading-5"]} tag={"h2"}>
          Tech partners
        </Heading>
        <FlexList $ph={[16, 0]} $mb={56} $flexWrap={"wrap"} $width={"100%"}>
          {pageData.techPartners.map((partner) => (
            <LI
              $mb={32}
              $minWidth={"20%"}
              listStyle="none"
              key={`tech-partners-${partner.name}`}
            >
              <ImageContainer
                $pa={[8, 32]}
                name={partner.name}
                image={partner}
              />
            </LI>
          ))}
        </FlexList>
        <GenericContactCard {...pageData.contactSection} />
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
