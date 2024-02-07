import { NextPage, GetStaticProps } from "next";
import { FC } from "react";
import {
  oakDefaultTheme,
  OakThemeProvider,
  OakFlex,
  OakMaxWidth,
  OakHeading,
  OakGrid,
  OakGridArea,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import CMSClient from "@/node-lib/cms";
import { AboutPartnersPage } from "@/common-lib/cms-types";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import GenericIntroCard from "@/components/GenericPagesComponents/GenericIntroCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import getPageProps from "@/node-lib/getPageProps";
import { SpacingProps } from "@/styles/utils/spacing";
import Layout from "@/components/AppComponents/Layout";
import Illustration from "@/components/SharedComponents/Illustration";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import CMSImage, {
  CMSImageProps,
} from "@/components/SharedComponents/CMSImage";
import AspectRatio from "@/components/SharedComponents/AspectRatio";

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
    <OakThemeProvider theme={oakDefaultTheme}>
      <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
        <OakMaxWidth
          $mb={["space-between-xl", "space-between-xxxl"]}
          $mt={["space-between-xl", "space-between-xxxl"]}
        >
          <GenericSummaryCard {...pageData} />
          <GenericIntroCard
            image={{
              illustration: "supporting",
              sizes: "(min-width: 750px) 720px, 100vw",
              priority: true,
            }}
            bodyPortableText={pageData.introPortableText}
          />

          <OakHeading
            $mb={["space-between-l", "space-between-m2"]}
            $font={["heading-6", "heading-5"]}
            tag={"h2"}
          >
            Meet our teachers
          </OakHeading>
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

          <OakFlex $mb={"space-between-xxxl"} $justifyContent={"center"}>
            <OakPrimaryButton
              element={"a"}
              href={resolveOakHref({ page: "our-teachers" })}
              iconName={"arrow-right"}
              isTrailingIcon={true}
            >
              Our teachers
            </OakPrimaryButton>
          </OakFlex>

          <OakHeading
            $mb={["space-between-l", "space-between-m2"]}
            $font={["heading-6", "heading-5"]}
            tag={"h2"}
          >
            Curriculum partners
          </OakHeading>
          <OakGrid
            $mb={"space-between-xl"}
            data-testid="curriculum-partners-list"
          >
            {pageData.curriculumPartners.map((partner, index) => (
              <OakGridArea
                $colSpan={[4, 3, 2]}
                $mb={"space-between-m2"}
                key={index}
              >
                <ImageContainer
                  $pa={[16, 24, 16]}
                  name={partner.name}
                  image={partner}
                />
              </OakGridArea>
            ))}
          </OakGrid>

          <OakHeading
            $mb={["space-between-l", "space-between-m2"]}
            $font={["heading-6", "heading-5"]}
            tag={"h2"}
          >
            Tech partners
          </OakHeading>
          <OakGrid $mb={"space-between-xl"} data-testid="tech-partners-list">
            {pageData.techPartners.map((partner) => (
              <OakGridArea $colSpan={[3, 2, 2]} $mb={"space-between-m2"}>
                <ImageContainer
                  $pa={[16, 24, 32]}
                  name={partner.name}
                  image={partner}
                />
              </OakGridArea>
            ))}
          </OakGrid>

          <GenericContactCard {...pageData.contactSection} />
        </OakMaxWidth>
      </Layout>
    </OakThemeProvider>
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
