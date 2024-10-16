import { FC } from "react";
import {
  OakP,
  OakHeading,
  OakUL,
  OakLI,
  OakTypography,
  OakFlex,
  OakBox,
  OakTertiaryOLNav,
  OakIcon,
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
import Card from "@/components/SharedComponents/Card/Card";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import Icon from "@/components/SharedComponents/Icon";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import CMSImage from "@/components/SharedComponents/CMSImage";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { basePortableTextComponents } from "@/components/SharedComponents/PortableText";
import { useCycleTwoEnabled } from "@/utils/curriculum/features";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { findContainingAnchor } from "@/utils/curriculum/dom";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

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

const PrincipleBullet = ({
  bulletText,
  children,
}: {
  bulletText: string;
  children?: React.ReactNode;
}) => (
  <OakLI $mb={["space-between-xs"]} data-testid="subject-principles">
    <OakFlex $alignItems={"flex-start"} $justifyContent={"flex-start"}>
      {/* @todo replace with OakFlex - work out $borderRadius */}
      <Flex
        $background={"mint"}
        $borderRadius={"50%"}
        $borderColor="mint"
        $mr={10}
      >
        <Icon name="arrow-right" $ma={"auto"} $pa={2} />
      </Flex>
      {bulletText}
    </OakFlex>
    {children}
  </OakLI>
);

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
  const { curriculumCMSInfo, curriculumInfo, curriculumSelectionSlugs } =
    props.data;
  const {
    curriculumExplainer,
    subjectPrinciples,
    partnerBio,
    curriculumPartner,
    curriculumPartnerOverviews,
    video,
    videoExplainer,
  } = curriculumCMSInfo;
  const { curriculaDesc } = curriculumInfo;
  const { subjectSlug } = curriculumSelectionSlugs;
  const isCycleTwoEnabled = useCycleTwoEnabled();

  const itemiseSubjectPrinciples = (
    principle: string,
    principleIndex: number,
  ) => {
    let subBullets: React.ReactNode = null;
    let principleText = principle;
    // Check if the principle is a sublist (divided by " • ")
    if (principle.includes(" • ")) {
      const sublist = principle.split(" • ");
      if (sublist.length > 0 && typeof sublist[0] === "string") {
        principleText = sublist[0];
        const bulletItems = sublist.slice(1);
        subBullets = (
          <OakUL>
            {bulletItems.map((subItem, subItemIndex) => (
              <OakLI
                $listStyle={"disc"}
                data-testid="sp-subbullet"
                key={subItemIndex}
                $ml="space-between-ssx"
                $mt="space-between-sssx"
                $mb="space-between-sssx"
              >
                {subItem}
              </OakLI>
            ))}
          </OakUL>
        );
      }
    }

    return (
      <PrincipleBullet bulletText={principleText} key={principleIndex}>
        {subBullets}
      </PrincipleBullet>
    );
  };

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

  const subjectIconName = getValidSubjectIconName(subjectSlug);

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
      {isCycleTwoEnabled && (
        <Box
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
        </Box>
      )}
      <Box
        id="curriculum-overview"
        aria-labelledby="curriculum-overview-heading"
        $maxWidth={1280}
        $mh={"auto"}
        $ph={16}
        $width={"100%"}
        role="region"
      >
        {isCycleTwoEnabled && (
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
            <Box
              $minWidth={300}
              $position={["static", "static", "sticky"]}
              $top={20}
              $pb={40}
              $display={["none", "none", "block"]}
            >
              {contents}
            </Box>
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
                        ...basePortableTextComponents.listItem,
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
        )}
        {!isCycleTwoEnabled && (
          <>
            <OakFlex $mb="space-between-ssx">
              <Box
                $mr={16}
                $pb={48}
                $maxWidth={["100%", "100%", "65%"]}
                $textAlign={"left"}
              >
                <ScreenReaderOnly>
                  <OakHeading
                    tag="h2"
                    id="curriculum-overview-heading"
                    data-testid="overview-heading"
                  >
                    Overview
                  </OakHeading>
                </ScreenReaderOnly>
                <OakHeading
                  tag="h3"
                  $font={["heading-6", "heading-5"]}
                  data-testid="intent-heading"
                  $mb="space-between-s"
                  line-height={48}
                >
                  Curriculum explainer
                </OakHeading>
                <OakTypography
                  $font={["body-2", "body-1"]}
                  style={{ fontWeight: "light" }}
                  $mt="space-between-ssx"
                  $mr="space-between-xs"
                  $whiteSpace={"break-spaces"}
                >
                  {curriculaDesc}
                </OakTypography>
              </Box>

              <Card
                $ml={40}
                $height={200}
                $maxWidth={[0, 0, 200]}
                $ma={"auto"}
                $zIndex={"inFront"}
                $transform={[
                  "rotate(-2.179deg) scale(1.5, 1.5) translate(15%,40%)",
                ]}
                $display={["none", "none", "flex"]}
                $background={"lemon50"}
              >
                <BrushBorders color="lemon50" />

                <OakIcon
                  iconName={subjectIconName}
                  $height="100%"
                  $width="100%"
                  $transform={["rotate(-2.179deg)", "scale(1.25, 1.25)"]}
                  alt=""
                />
              </Card>
            </OakFlex>
            <Card
              $maxWidth={"100%"}
              $background={"mint30"}
              $zIndex={"neutral"}
              $mb={80}
            >
              <BrushBorders color={"mint30"} />
              <Box $ma={16}>
                <OakHeading tag="h3" $font={["heading-6", "heading-5"]}>
                  Subject principles
                </OakHeading>
                <OakUL
                  $font={["body-2", "body-1"]}
                  $mt="space-between-m"
                  $reset={true}
                >
                  {subjectPrinciples.map((item, i) =>
                    itemiseSubjectPrinciples(item, i),
                  )}
                </OakUL>
              </Box>
            </Card>
          </>
        )}
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
              <ButtonAsLink
                variant="buttonStyledAsLink"
                label="Read more about our new curriculum"
                page={"blog-single"}
                blogSlug="our-approach-to-curriculum"
                icon="chevron-right"
                background={"white"}
                $iconPosition="trailing"
                iconBackground="white"
                $textAlign={"start"}
              />
            </Flex>
          </OakFlex>
        )}

        {!isCycleTwoEnabled && (
          <Card $background={"lemon30"} $width={"100%"} $mb={[36, 48]}>
            <BrushBorders color="lemon30" />
            <OakFlex
              $justifyContent={"center"}
              $alignItems={"center"}
              $pa="inner-padding-m"
              $flexDirection={["column", "row"]}
              $gap={["all-spacing-4", "all-spacing-7"]}
            >
              <CMSImage
                $background={"grey20"}
                $ma={"auto"}
                $ml={20}
                $mr={32}
                $height={180}
                $width={180}
                image={{
                  ...curriculumPartner.image,
                  altText: `Logo for ${curriculumPartner.name}`,
                }}
              />
              <Box>
                <OakHeading
                  tag="h3"
                  $font={["heading-6", "heading-5"]}
                  $mb="space-between-s"
                >
                  {partnerTitle}
                </OakHeading>
                <OakTypography $font={"body-1"}>{partnerBio}</OakTypography>
              </Box>
            </OakFlex>
          </Card>
        )}
      </Box>

      {isCycleTwoEnabled && (
        <OakBox $background={"bg-decorative1-subdued"} $pv="inner-padding-xl4">
          <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
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
                  (
                    { curriculumPartner, partnerBio },
                    curriculumPartnerIndex,
                  ) => {
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
          </Box>
        </OakBox>
      )}
    </>
  );
};
export default OverviewTab;
