import { FC } from "react";
import {
  OakP,
  OakHeading,
  OakLI,
  OakTypography,
  OakFlex,
  OakBox,
  OakTertiaryOLNav,
  OakSecondaryLink,
} from "@oaknational/oak-components";
import {
  PortableText,
  PortableTextBlockComponent,
  PortableTextComponents,
} from "@portabletext/react";
import styled from "styled-components";
import slugify from "slugify";
import { useRouter } from "next/router";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CMSImage from "@/components/SharedComponents/CMSImage";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import { basePortableTextComponents } from "@/components/SharedComponents/PortableText";
import { findContainingAnchor } from "@/utils/curriculum/dom";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { resolveOakHref } from "@/common-lib/urls";

export type OverviewTabProps = {
  data: {
    curriculumInfo: CurriculumOverviewMVData;
    curriculumCMSInfo: CurriculumOverviewSanityData;
    curriculumSelectionSlugs: CurriculumSelectionSlugs;
  };
};

const ExplainerStyles = styled("div")`
  h3:first-child {
    margin-top: 0;
  }
  h3 {
    font-weight: 600;
    margin-top: 1rem;
  }
  h4 {
    font-weight: 600;
    margin-top: 1rem;
  }
  h5 {
    font-weight: 600;
    margin-top: 0.5rem;
  }
  h6 {
    font-weight: 600;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
  ul + h3,
  p + h3 {
    margin-top: 4.5rem;
  }
  ul + h4,
  p + h4 {
    margin-top: 1.5 em;
  }
  ul + h5,
  p + h5 {
    margin-top: 3.5rem;
  }
  ul + h6,
  p + h6 {
    margin-top: 0.5rem;
  }

  h3 + h4 {
    margin-top: 1.5rem;
  }
  h4 + h5 {
    margin-top: 1.5rem;
  }
  h5 + h6 {
    margin-top: 1.5rem;
  }
`;

const slugifyHash = (input: string) => slugify(input).toLocaleLowerCase();

const blockHeadingComponents: PortableTextComponents["block"] = {
  heading1: (props) => (
    <OakHeading
      tag="h3"
      id={`header-${slugifyHash(props.value.children[0]?.text ?? "unknown")}`}
      $font={["heading-5", "heading-5", "heading-4"]}
    >
      {props.children}
    </OakHeading>
  ),
  heading2: (props) => (
    <OakHeading tag="h4" $font={["body-2", "body-2", "heading-6"]}>
      {props.children}
    </OakHeading>
  ),
  heading3: (props) => (
    <OakHeading tag="h5" $font={["body-2"]}>
      {props.children}
    </OakHeading>
  ),
  heading4: (props) => (
    <OakHeading tag="h6" $font={["body-2"]}>
      {props.children}
    </OakHeading>
  ),
};

const OverviewTab: FC<OverviewTabProps> = (props: OverviewTabProps) => {
  const router = useRouter();
  const { curriculumCMSInfo } = props.data;
  const {
    curriculumExplainer,
    curriculumPartnerOverviews,
    video,
    videoExplainer,
  } = curriculumCMSInfo;
  const isVideoEnabled = video && videoExplainer;

  const partnerTitle = `Our curriculum partner${
    curriculumPartnerOverviews?.length > 1 ? "s" : ""
  }`;

  const h1Headings = (curriculumExplainer.explainerRaw ?? []).filter(
    (block) => {
      return block.style === "heading1";
    },
  );

  const goToAnchor = (selector: string) => {
    Array.from(document.querySelectorAll(selector))
      .find((el: Element) => el.checkVisibility())
      ?.scrollIntoView();
  };

  const navItems = h1Headings.map((heading) => {
    return {
      title: heading.children[0].text,
      href: `#header-${slugifyHash(heading.children[0].text)}`,
    };
  });

  if (isVideoEnabled) {
    navItems.push({
      href: "#header-video-guide",
      title: "Video guide",
    });
  }

  navItems.push({
    href: "#header-our-curriculum-partner",
    title: partnerTitle,
  });

  const onClickNavItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      const anchor = findContainingAnchor(e.target);
      if (anchor) {
        const url = new URL(anchor.href);
        router.replace(url.hash);
        goToAnchor(url.hash);
      }
    }
  };

  const contents = (
    <OakFlex $gap={"space-between-m"} $flexDirection={"column"}>
      <OakTertiaryOLNav
        items={navItems}
        title={"Contents"}
        onClick={onClickNavItem}
      />
    </OakFlex>
  );

  return (
    <>
      <OakBox
        $minWidth={"100%"}
        style={{ marginTop: -40 }}
        $display={["block", "block", "none"]}
      >
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $ph="inner-padding-m"
          $pv="inner-padding-l"
        >
          {contents}
        </OakBox>
      </OakBox>
      <OakBox
        id="curriculum-overview"
        aria-labelledby="curriculum-overview-heading"
        $maxWidth="all-spacing-24"
        $mh={"auto"}
        $ph="inner-padding-m"
        $width={"100%"}
        role="region"
      >
        <OakFlex $gap={"all-spacing-16"} $alignItems={"flex-start"}>
          <ScreenReaderOnly>
            <OakHeading
              tag="h2"
              data-testid="overview-heading"
              id="curriculum-overview-heading"
            >
              Explainer
            </OakHeading>
          </ScreenReaderOnly>
          <OakBox
            style={{ minWidth: 300 }}
            $position={["static", "static", "sticky"]}
            $top="all-spacing-5"
            $pb="inner-padding-xl3"
            $display={["none", "none", "block"]}
          >
            {contents}
          </OakBox>
          <OakFlex
            $mb="space-between-ssx"
            $mt={["space-between-m", "space-between-m", "space-between-none"]}
          >
            <Box
              $pb={48}
              $maxWidth={["100%", "65%", "65%"]}
              $mh={["auto", "auto", 0]}
              $textAlign={"left"}
            >
              <OakBox data-testid="explainer">
                <ExplainerStyles>
                  <PortableText
                    value={curriculumExplainer.explainerRaw}
                    components={{
                      ...basePortableTextComponents.list,
                      listItem: {
                        bullet: (props) => (
                          <OakLI $font={["list-item-2", "list-item-1"]}>
                            {props.children}
                          </OakLI>
                        ),
                        number: (props) => (
                          <OakLI $font={["list-item-2", "list-item-1"]}>
                            {props.children}
                          </OakLI>
                        ),
                      },
                      block: {
                        ...basePortableTextComponents.block,
                        ...blockHeadingComponents,
                      } as PortableTextBlockComponent,
                      types: {},
                      marks: {
                        strong: basePortableTextComponents.marks!.strong,
                        em: basePortableTextComponents.marks!.em,
                      },
                    }}
                  />
                </ExplainerStyles>
              </OakBox>
            </Box>
          </OakFlex>
        </OakFlex>
        {isVideoEnabled && (
          <OakFlex
            data-testid="video-guide"
            $alignItems={"center"}
            $justifyContent={"flex-start"}
            $flexDirection={["column-reverse", "row"]}
            $gap={["all-spacing-6", "all-spacing-16"]}
            $mb={["space-between-l", "space-between-xxxl"]}
          >
            <Box $minWidth={["100%", "50%"]} $maxWidth={["100%", "50%"]}>
              <CMSVideo video={video} location="lesson" />
            </Box>
            {/* @todo replace with OakFlex - work out $maxWidth */}
            <Flex
              $flexDirection={"column"}
              $maxWidth={["100%", "30%"]}
              $alignItems={"flex-start"}
              $gap={[16, 24]}
            >
              <OakHeading
                tag="h3"
                $font={["heading-6", "heading-5"]}
                id="header-video-guide"
              >
                Video guide
              </OakHeading>
              <OakP $font={"body-1"}>{videoExplainer}</OakP>
              <OakP $font={"body-2-bold"} $color="black">
                <OakSecondaryLink
                  href={resolveOakHref({
                    page: "blog-single",
                    blogSlug: "our-approach-to-curriculum",
                  })}
                  iconName="chevron-right"
                  isTrailingIcon={true}
                  color="black"
                >
                  Read more about our new curriculum
                </OakSecondaryLink>
              </OakP>
            </Flex>
          </OakFlex>
        )}
      </OakBox>
      <OakBox $background={"bg-decorative1-subdued"} $pv="inner-padding-xl4">
        <OakBox
          $maxWidth="all-spacing-24"
          $mh={"auto"}
          $ph="inner-padding-l"
          $width={"100%"}
        >
          <OakFlex
            $gap={["space-between-m", "space-between-m2"]}
            $flexDirection={"column"}
          >
            <OakBox $display={["block", "none"]}>
              <OakHeading
                tag="h3"
                $font={["heading-5"]}
                id="header-our-curriculum-partner"
              >
                {partnerTitle}
              </OakHeading>
            </OakBox>
            <OakFlex
              $gap={["space-between-l", "space-between-m2"]}
              $flexDirection={"column"}
            >
              {curriculumPartnerOverviews.map(
                ({ curriculumPartner, partnerBio }, curriculumPartnerIndex) => {
                  return (
                    <OakFlex
                      data-testid="curriculum-partner"
                      $justifyContent={"center"}
                      $alignContent={"start"}
                      $gap={["space-between-s", "space-between-m2"]}
                      $flexDirection={["column", "row"]}
                    >
                      <OakBox
                        $borderRadius="border-radius-s"
                        $overflow={"hidden"}
                        $borderColor="border-neutral-lighter"
                        $borderStyle={"solid"}
                        $maxHeight={["all-spacing-18", "all-spacing-19"]}
                        $maxWidth={["all-spacing-18", "all-spacing-19"]}
                        $minHeight={["all-spacing-18", "all-spacing-19"]}
                        $minWidth={["all-spacing-18", "all-spacing-19"]}
                      >
                        <CMSImage
                          image={{
                            ...curriculumPartner.image,
                            altText: `Logo for ${curriculumPartner.name}`,
                          }}
                        />
                      </OakBox>
                      <OakFlex
                        $flexGrow={1}
                        $flexDirection={"column"}
                        $gap={"space-between-s"}
                        $justifyContent={"center"}
                      >
                        {curriculumPartnerIndex === 0 && (
                          <OakBox $display={["none", "block"]}>
                            <OakHeading
                              tag="h3"
                              $font={["heading-5"]}
                              id="header-our-curriculum-partner"
                            >
                              {partnerTitle}
                            </OakHeading>
                          </OakBox>
                        )}
                        <OakHeading tag="h4" $font={["heading-6"]}>
                          {curriculumPartner.name}
                        </OakHeading>
                        <OakTypography $font={"body-1"}>
                          {partnerBio}
                        </OakTypography>
                      </OakFlex>
                    </OakFlex>
                  );
                },
              )}
            </OakFlex>
          </OakFlex>
        </OakBox>
      </OakBox>
    </>
  );
};
export default OverviewTab;
