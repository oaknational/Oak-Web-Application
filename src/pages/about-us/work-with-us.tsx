import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import { Fragment } from "react";
import {
  OakFlex,
  OakMaxWidth,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakTypography,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import CMSClient from "@/node-lib/cms";
import { AboutWorkWithUsPage } from "@/common-lib/cms-types";
import Layout from "@/components/AppComponents/Layout";
import Card from "@/components/SharedComponents/Card";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import GenericIntroCard from "@/components/GenericPagesComponents/GenericIntroCard";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { ENABLE_NEW_ABOUT_US } from "@/config/flags";

export type AboutPageProps = {
  pageData: AboutWorkWithUsPage & { topNav: TopNavProps };
};

const getWorkWithUsCards = (aboutPage: AboutWorkWithUsPage) => {
  const { advisory, curriculumPartner, joinTheTeam, teacherResearch } =
    aboutPage.cards;
  return [advisory, curriculumPartner, joinTheTeam, teacherResearch];
};

const AboutUsBoard: NextPage<AboutPageProps> = ({ pageData }) => {
  const { seo, topNav } = pageData;

  return (
    <Layout
      seoProps={getSeoProps(seo)}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <OakMaxWidth
        $mb={["spacing-56", "spacing-80"]}
        $mt={["spacing-56", "spacing-80"]}
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
        <OakGrid
          $mb={["spacing-72", "spacing-80"]}
          $cg={"spacing-24"}
          $rg={["spacing-0", "spacing-32"]}
        >
          {getWorkWithUsCards(pageData).map((card) => (
            <Fragment key={card.title}>
              <OakGridArea $colSpan={[12, 6]}>
                <Card $ph={[16, 24]} $pv={[32, 24]} $background={"aqua"}>
                  <OakHeading
                    $font={["heading-6", "heading-5"]}
                    tag={"h2"}
                    $mb={"spacing-24"}
                  >
                    {card.title}
                  </OakHeading>
                  <OakTypography
                    $mb={"spacing-32"}
                    $font={["body-2", "body-1"]}
                  >
                    <PortableTextWithDefaults value={card.bodyPortableText} />
                  </OakTypography>
                  {card.cta?.linkType == "external" && (
                    <OakFlex>
                      <OakPrimaryButton
                        element="a"
                        href={card.cta.external}
                        iconName={"external"}
                        isTrailingIcon={true}
                      >
                        {card.cta.label}
                      </OakPrimaryButton>
                    </OakFlex>
                  )}
                  <BrushBorders hideOnMobileH color={"aqua"} />
                </Card>
              </OakGridArea>
            </Fragment>
          ))}
        </OakGrid>

        <GenericContactCard {...pageData.contactSection} />
      </OakMaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context,
) => {
  if (ENABLE_NEW_ABOUT_US) {
    return {
      redirect: {
        destination: "/about-us/get-involved",
        permanent: false,
      },
    };
  } else {
    return getPageProps({
      page: "work-with-us::getStaticProps",
      context,
      getProps: async () => {
        const isPreviewMode = context.preview === true;

        const aboutWorkWithUsPage = await CMSClient.aboutWorkWithUsPage({
          previewMode: isPreviewMode,
        });

        const topNavData = await curriculumApi2023.topNav();

        if (!aboutWorkWithUsPage || !topNavData) {
          return {
            notFound: true,
          };
        }

        const results: GetStaticPropsResult<AboutPageProps> = {
          props: {
            pageData: { ...aboutWorkWithUsPage, topNav: topNavData },
          },
        };

        return results;
      },
    });
  }
};

export default AboutUsBoard;
