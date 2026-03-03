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
  OakLink,
  OakSpan,
  OakBoxProps,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";
import {
  PortableText,
  PortableTextBlockComponent,
  PortableTextComponents,
} from "@portabletext/react";
import styled from "styled-components";
import slugify from "slugify";

import useAnalytics from "@/context/Analytics/useAnalytics";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CMSImage from "@/components/SharedComponents/CMSImage";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import { basePortableTextComponents } from "@/components/SharedComponents/PortableText";
import { findContainingAnchor } from "@/utils/curriculum/dom";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { PhaseValueType } from "@/browser-lib/avo/Avo";
import { resolveOakHref } from "@/common-lib/urls";

export type CurriculumOverviewTabData = {
  subjectTitle: string;
  curriculumCMSInfo: CurriculumOverviewSanityData;
  curriculumSelectionSlugs: CurriculumSelectionSlugs;
};

export type OverviewTabProps = {
  /**
   * Handler allowing the parent to control the navigation behaviour.
   * Lets us use this component in both app and pages router.
   *
   * Can be removed once the integrated programme page is launched and components are reorganised.
   */
  onClickNavItem: (pathname: string) => void;
  /**
   * Inline padding for the content area.
   *
   * The integrated programme page layout has different padding requirements, so
   * so we use this prop to control the padding.
   *
   * Can be removed once the integrated programme page is launched and components are reorganised.
   */
  ph?: OakBoxProps["$ph"];
  /**
   * Outer padding for the content area.
   *
   * The integrated programme page layout has different padding requirements, to fill
   * the 1280px grid we use this prop to control the padding outside the grid.
   *
   * Can be removed once the integrated programme page is launched and components are reorganised.
   */
  outerPh?: OakBoxProps["$ph"];
  data: CurriculumOverviewTabData;
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

const markComponents: PortableTextComponents["marks"] = {
  link: ({ children, value }) => {
    return <OakLink {...value}>{children}</OakLink>;
  },
};

const OverviewTab: FC<OverviewTabProps> = ({
  onClickNavItem,
  ph = "spacing-16",
  outerPh = "spacing-0",
  data,
}: OverviewTabProps) => {
  const { track } = useAnalytics();

  const { curriculumCMSInfo, curriculumSelectionSlugs, subjectTitle } = data;
  const { subjectSlug, phaseSlug } = curriculumSelectionSlugs;
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

  const handleAnalytics = () => {
    track.curriculumExplainerExplored({
      subjectTitle: subjectTitle,
      subjectSlug: subjectSlug,
      platform: "owa",
      product: "curriculum visualiser",
      engagementIntent: "explore",
      componentType: "explainer_tab",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      phase: phaseSlug as PhaseValueType,
    });
  };

  const handleClickNavItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (e.target instanceof HTMLElement) {
      const anchor = findContainingAnchor(e.target);
      if (anchor) {
        const url = new URL(anchor.href);
        handleAnalytics();
        onClickNavItem(url.hash);
        goToAnchor(url.hash);
      }
    }
  };

  const contents = (
    <OakFlex $gap={"spacing-24"} $flexDirection={"column"}>
      <OakTertiaryOLNav
        items={navItems}
        title={"Contents"}
        onClick={handleClickNavItem}
      />
    </OakFlex>
  );

  return (
    <OakBox
      $mt={["spacing-0", "spacing-0", "spacing-56"]}
      $color="text-primary"
    >
      <OakBox $minWidth={"100%"} $display={["block", "block", "none"]}>
        <OakBox
          $background={"bg-decorative1-very-subdued"}
          $ph={ph}
          $pv="spacing-32"
        >
          {contents}
        </OakBox>
      </OakBox>
      <OakBox $ph={outerPh}>
        <OakBox
          id="curriculum-overview"
          aria-labelledby="curriculum-overview-heading"
          tabIndex={-1}
          $maxWidth="spacing-1280"
          $mh={"auto"}
          $width={"100%"}
          role="region"
          $ph={ph}
        >
          <OakGrid $cg={"spacing-16"}>
            <ScreenReaderOnly>
              <OakHeading
                tag="h2"
                data-testid="overview-heading"
                id="curriculum-overview-heading"
              >
                Explainer
              </OakHeading>
            </ScreenReaderOnly>
            <OakGridArea
              $display={["none", "none", "block"]}
              $colSpan={[12, 12, 3]}
            >
              <OakBox
                $position={["static", "static", "sticky"]}
                $top="spacing-20"
                $pb="spacing-40"
              >
                {contents}
              </OakBox>
            </OakGridArea>
            <OakGridArea
              $mb="spacing-8"
              $mt={["spacing-32", "spacing-32", "spacing-0"]}
              $colSpan={[12, 12, 6]}
              $colStart={[1, 1, 5]}
            >
              <OakBox
                $pb={"spacing-48"}
                $mh={["auto", "auto", "spacing-0"]}
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
                          link: markComponents.link,
                        },
                      }}
                    />
                  </ExplainerStyles>
                </OakBox>
              </OakBox>
            </OakGridArea>
          </OakGrid>
          {isVideoEnabled && (
            <OakGrid
              data-testid="video-guide"
              $cg={"spacing-16"}
              $rg={"spacing-24"}
              $mb={["spacing-48", "spacing-80"]}
            >
              <OakGridArea
                $colSpan={[12, 6]}
                $justifyContent="center"
                $order={[1, 0]}
              >
                <CMSVideo video={video} location="lesson" />
              </OakGridArea>
              <OakGridArea
                $colSpan={[12, 6, 4]}
                $colStart={[1, 8, 8]}
                $justifyContent="center"
                $gap="spacing-24"
                $order={[0, 1]}
              >
                <OakHeading
                  tag="h3"
                  $font={["heading-6", "heading-5"]}
                  id="header-video-guide"
                >
                  Video guide
                </OakHeading>
                <OakP $font={"body-1"}>{videoExplainer}</OakP>
                <OakSpan
                  $font={"body-2-bold"}
                  $color="text-primary"
                  $textWrap="balance"
                >
                  <OakSecondaryLink
                    href={resolveOakHref({
                      page: "blog-single",
                      blogSlug: "our-approach-to-curriculum",
                    })}
                    iconName="chevron-right"
                    isTrailingIcon={true}
                    color="text-primary"
                  >
                    Read more about our new curriculum
                  </OakSecondaryLink>
                </OakSpan>
              </OakGridArea>
            </OakGrid>
          )}
        </OakBox>
      </OakBox>
      <OakBox $background={"bg-decorative1-subdued"} $pv="spacing-48">
        <OakBox $maxWidth="spacing-1280" $mh={"auto"} $ph={ph} $width={"100%"}>
          <OakFlex
            $gap={["spacing-24", "spacing-32"]}
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
              $gap={["spacing-48", "spacing-32"]}
              $flexDirection={"column"}
            >
              {curriculumPartnerOverviews.map(
                (
                  { curriculumPartner, partnerBio, partnerBioPortableTextRaw },
                  curriculumPartnerIndex,
                ) => {
                  return (
                    <OakFlex
                      key={`curriculum-partner-${curriculumPartnerIndex}`}
                      data-testid="curriculum-partner"
                      $justifyContent={"center"}
                      $alignContent={"start"}
                      $gap={["spacing-16", "spacing-32"]}
                      $flexDirection={["column", "row"]}
                    >
                      <OakBox
                        $borderRadius="border-radius-s"
                        $overflow={"hidden"}
                        $borderColor="border-neutral-lighter"
                        $borderStyle={"solid"}
                        $maxHeight={["spacing-180", "spacing-240"]}
                        $maxWidth={["spacing-180", "spacing-240"]}
                        $minHeight={["spacing-180", "spacing-240"]}
                        $minWidth={["spacing-180", "spacing-240"]}
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
                        $gap={"spacing-16"}
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
                          {!partnerBioPortableTextRaw ? (
                            partnerBio
                          ) : (
                            <PortableText
                              value={partnerBioPortableTextRaw}
                              components={{
                                block: basePortableTextComponents.block,
                                types: {},
                                marks: {
                                  strong:
                                    basePortableTextComponents.marks!.strong,
                                  em: basePortableTextComponents.marks!.em,
                                  link: markComponents.link,
                                },
                              }}
                            />
                          )}
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
    </OakBox>
  );
};
export default OverviewTab;
