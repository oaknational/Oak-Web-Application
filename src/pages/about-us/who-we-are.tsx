import { ReactNode, useMemo } from "react";
import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakP,
  OakIcon,
  OakSpan,
  OakBoxProps,
  OakIconProps,
} from "@oaknational/oak-components";
import styled from "styled-components";

import CMSClient from "@/node-lib/cms";
import { AboutWhoWeArePage } from "@/common-lib/cms-types";
import { decorateWithIsr } from "@/node-lib/isr";
import Layout from "@/components/AppComponents/Layout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";

export type AboutPageProps = {
  pageData: AboutWhoWeArePage;
};

const CustomHeaderTextOakGridArea = styled(OakGridArea)`
  grid-column: span 6;
  @media (max-width: 920px) {
    grid-column: span 12;
  }
`;

const CustomHeaderImageOakGridArea = styled(OakGridArea)`
  display: block;
  @media (max-width: 920px) {
    display: none;
  }
`;

const CustomWeAreItemOakGridArea = styled(OakGridArea)`
  grid-column: span 3;
  @media (max-width: 1040px) {
    grid-column: span 6;
  }
`;

function WeAre() {
  const items: {
    background: OakBoxProps["$background"];
    title: string;
    text: string;
  }[] = [
    {
      background: "bg-decorative3-main",
      title: "Built for the reality of teaching",
      text: "We get it. Time is tight, classes vary, and only teachers can know pupils best. That’s why our materials are flexible tools to adapt, not scripts to follow: a starting point that supports your expertise and style.",
    },
    {
      background: "bg-decorative4-main",
      title: "Expert created and quality assured",
      text: "Created by subject and curriculum experts, our resources are informed by the best available evidence of what works, aligned to the national curriculum and tested by real teachers.",
    },
    {
      background: "bg-decorative2-main",
      title: "Free, and always will be",
      text: "We’re funded by the Department for Education. No paywalls, package tiers, or hidden costs.",
    },
    {
      background: "bg-decorative5-main",
      title: "Independent and optional",
      text: "Oak is by teachers, for teachers. Our board is publicly appointed, and our partners selected through an open process.",
    },
  ];
  return (
    <InnerMaxWidth>
      <OakFlex
        $flexDirection={"column"}
        $mv="space-between-xxxl"
        $gap={"all-spacing-10"}
      >
        <OakHeading tag="h3" $textAlign={"center"} $font={"heading-3"}>
          We are...
        </OakHeading>
        <OakGrid
          $rg={"all-spacing-4"}
          $cg={"all-spacing-4"}
          $gridAutoRows={"1fr"}
          $mb={"space-between-xxl"}
        >
          {items.map(({ background, title, text }) => {
            return (
              <CustomWeAreItemOakGridArea $colSpan={12}>
                <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
                  <OakBox
                    $height={"all-spacing-18"}
                    $background={background}
                    $borderRadius={"border-radius-m2"}
                   />
                  <OakFlex $gap={"all-spacing-4"} $flexDirection={"column"}>
                    <OakHeading tag="h3" $font={"heading-5"}>
                      {title}
                    </OakHeading>
                    <OakP>{text}</OakP>
                  </OakFlex>
                </OakFlex>
              </CustomWeAreItemOakGridArea>
            );
          })}
        </OakGrid>
      </OakFlex>
    </InnerMaxWidth>
  );
}

function Header() {
  return (
    <InnerMaxWidth>
      <OakGrid
        $cg="space-between-s"
        $rg="space-between-s"
        $pv={"inner-padding-xl7"}
      >
        <CustomHeaderTextOakGridArea $colSpan={12}>
          <OakFlex $flexDirection={"column"} $gap={"all-spacing-6"}>
            <OakHeading tag="h1" $font={"heading-2"}>
              <OakSpan $background="mint" $ph={"inner-padding-ssx"}>
                About Oak
              </OakSpan>
            </OakHeading>
            <OakP $font={"heading-light-3"}>
              We're here to support and inspire teachers to deliver great
              teaching, so every pupil benefits
            </OakP>
          </OakFlex>
        </CustomHeaderTextOakGridArea>
        <CustomHeaderImageOakGridArea $colSpan={4} $colStart={9}>
          <OakBox
            $background={"mint30"}
            $borderStyle={"solid"}
            $borderColor={"mint110"}
            $height={"all-spacing-18"}
           />
        </CustomHeaderImageOakGridArea>
      </OakGrid>
    </InnerMaxWidth>
  );
}

const CustomFlex = styled(OakFlex)`
  flex-direction: row;

  @media (max-width: 1020px) {
    flex-direction: column;
  }
`;

function Breakout() {
  return (
    <CustomFlex $background={"mint"} $flexDirection={["column", "row", "row"]}>
      <OakFlex
        $flexGrow={1}
        $background={"mint110"}
        $height="all-spacing-20"
        $aspectRatio={"4/3"}
       />
      <OakFlex
        $flexShrink={1}
        $ph={"inner-padding-xl8"}
        $pv={"inner-padding-xl3"}
        $alignItems={"center"}
      >
        <OakP $font={"heading-light-5"}>
          We’re Oak, your trusted planning partner for great teaching. Our free,
          adaptable resources evolve with education to give teachers and schools
          the latest tools to deliver inspiring lessons, save time and improve
          pupil outcomes.
        </OakP>
      </OakFlex>
    </CustomFlex>
  );
}

function Timeline() {
  const items = [
    {
      subtitle: "From then",
      title: "A rapid response to the pandemic",
      text: [
        "In 2020, teachers needed a quick way to keep pupils learning during lockdown. So we brought together a group of expert partners to support schools with thousands of lessons designed for remote learning.",
      ],
    },
    {
      subtitle: "To now",
      title: "Complete resources for the classroom, schools and trusts",
      text: [
        "From early years to exam years, we now provide complete curriculum support for the classroom. Every national curriculum subject, every unit, every lesson, in one place.",
        "We’re also transforming lesson prep with AI tools that help teachers create, adapt, and enhance their lessons in minutes, while keeping quality high and content safe.",
      ],
    },
    {
      subtitle: "And beyond",
      title: "Staying ahead in a changing world",
      text: [
        "We’ve always anticipated the emerging needs of teachers – from building safe and secure AI tools, to making our platform code available to partners who want to integrate it directly. We’ll keep innovating as we find new ways to help teachers stay ahead in a changing world.",
      ],
    },
  ];
  return (
    <OakBox $background={"mint30"}>
      <InnerMaxWidth>
        <OakFlex
          $flexDirection={"column"}
          $gap={"all-spacing-10"}
          $pt={"inner-padding-xl7"}
        >
          <OakGrid $cg="space-between-s" $rg="space-between-s">
            <OakGridArea $colSpan={[12, 12, 8]} $colStart={[0, 0, 3]}>
              <OakFlex $gap={"all-spacing-2"} $flexDirection={"column"}>
                <OakBox $font={"heading-5"}>
                  <OakSpan $background={"mint"} $ph={"inner-padding-ssx"}>
                    Oak’s story
                  </OakSpan>
                </OakBox>
                <OakBox $font={"heading-3"}>
                  As teaching evolves, so do we...
                </OakBox>
              </OakFlex>
            </OakGridArea>
          </OakGrid>
          <OakGrid $cg="space-between-s" $rg="space-between-s">
            <OakGridArea $colSpan={[12, 12, 12]} $colStart={[0, 2, 2]}>
              <OakFlex $flexDirection={"column"}>
                {items.map((item, itemIndex) => {
                  const isLast = items.length - 1 === itemIndex;
                  return (
                    <OakFlex $gap={"all-spacing-4"}>
                      <OakFlex
                        $width={"all-spacing-6"}
                        $flexShrink={0}
                        $flexDirection={"column"}
                        $alignItems={"center"}
                      >
                        <OakFlex
                          $background={"bg-decorative1-main"}
                          $borderColor={"border-decorative1-stronger"}
                          $borderStyle={"solid"}
                          $ba={"border-solid-m"}
                          $width={"all-spacing-6"}
                          $height={"all-spacing-6"}
                          $borderRadius={"border-radius-circle"}
                          $flexGrow={0}
                         />
                        <OakFlex
                          $borderColor={"border-decorative1-stronger"}
                          $borderStyle={isLast ? "dashed" : "solid"}
                          $ba={"border-solid-none"}
                          $bl={"border-solid-l"}
                          $width={"space-between-none"}
                          $flexGrow={1}
                         />
                      </OakFlex>
                      <OakFlex
                        $flexDirection={"column"}
                        $gap={"all-spacing-2"}
                        $mb={"space-between-xxl"}
                      >
                        <OakBox $font={"body-2-bold"}>
                          <OakSpan
                            $ph={"inner-padding-ssx"}
                            $background={"mint"}
                          >
                            {item.subtitle}
                          </OakSpan>
                        </OakBox>
                        <OakBox $font={"heading-light-5"}>{item.title}</OakBox>
                        <OakBox>
                          {item.text.map((textItem) => {
                            return <OakP>{textItem}</OakP>;
                          })}
                        </OakBox>
                      </OakFlex>
                    </OakFlex>
                  );
                })}
              </OakFlex>
            </OakGridArea>
          </OakGrid>
        </OakFlex>
      </InnerMaxWidth>
    </OakBox>
  );
}

function Explore() {
  const items: {
    iconName: OakIconProps["iconName"];
    title: string;
  }[] = [
    {
      iconName: "curriculum-plan",
      title: "About Oak’s curriculum",
    },
    {
      iconName: "ai-worksheet",
      title: "Oak’s impact",
    },
    {
      iconName: "ai-worksheet",
      title: "Meet the team",
    },
    {
      iconName: "ai-worksheet",
      title: "Get involved",
    },
  ] as const;

  return (
    <OakBox $background={"mint"}>
      <InnerMaxWidth>
        <OakFlex
          $flexDirection={"column"}
          $mv="space-between-xxxl"
          $gap={"all-spacing-10"}
        >
          <OakHeading tag="h3" $textAlign={"center"} $font={"heading-4"}>
            Explore more about Oak
          </OakHeading>
          <OakGrid
            $rg={"all-spacing-4"}
            $cg={"all-spacing-4"}
            $gridAutoRows={"1fr"}
          >
            {items.map(({ title, iconName }) => {
              return (
                <OakGridArea $colSpan={[12, 6, 6]}>
                  <OakFlex
                    $flexDirection={"row"}
                    $pa={"inner-padding-m"}
                    $background={"white"}
                    $gap={"all-spacing-4"}
                    $alignItems={"center"}
                    $borderRadius={"border-radius-m2"}
                  >
                    <OakFlex>
                      <OakIcon iconName={iconName} />
                    </OakFlex>
                    <OakFlex $flexGrow={1} $font={"body-1-bold"}>
                      {title}
                    </OakFlex>
                    <OakFlex>
                      <OakIcon iconName="arrow-right" />
                    </OakFlex>
                  </OakFlex>
                </OakGridArea>
              );
            })}
          </OakGrid>
        </OakFlex>
      </InnerMaxWidth>
    </OakBox>
  );
}

function InnerMaxWidth({ children }: { children: ReactNode }) {
  const styleAttrs = useMemo(() => ({ maxWidth: 1280 + 40 * 2 }), []);
  return (
    <OakBox
      style={styleAttrs}
      $mh={"auto"}
      $ph={["inner-padding-m", "inner-padding-xl3", "inner-padding-xl3"]}
    >
      {children}
    </OakBox>
  );
}

const AboutWhoWeAre: NextPage<AboutPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <Header />
      <Breakout />
      <Timeline />
      <WeAre />
      <Explore />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "who-are-we::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const aboutWhoWeArePage = await CMSClient.aboutWhoWeArePage({
        previewMode: isPreviewMode,
      });

      if (!aboutWhoWeArePage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<AboutPageProps> = {
        props: {
          pageData: aboutWhoWeArePage,
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default AboutWhoWeAre;
