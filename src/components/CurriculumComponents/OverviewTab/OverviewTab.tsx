import { FC } from "react";
import {
  OakP,
  OakHeading,
  OakUL,
  OakLI,
  OakTypography,
  OakFlex,
  OakBox,
  OakTertiaryButton,
  OakIcon,
} from "@oaknational/oak-components";
import {
  PortableText,
  PortableTextBlockComponent,
  PortableTextComponents,
} from "@portabletext/react";
import styled from "styled-components";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Card from "@/components/SharedComponents/Card/Card";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import Icon from "@/components/SharedComponents/Icon";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import CMSImage from "@/components/SharedComponents/CMSImage";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { basePortableTextComponents } from "@/components/SharedComponents/PortableText";
import {
  isCurricPartnerHackEnabled,
  useCycleTwoEnabled,
} from "@/utils/curriculum/features";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

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
    font-size: 2rem;
  }
  h4 {
    font-weight: 600;
    margin-top: 1rem;
    font-size: 1.25rem;
  }
  h5 {
    font-weight: 600;
    margin-top: 0.5rem;
    font-size: 1rem;
  }
  h6 {
    font-weight: 600;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1rem;
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
    <h3 id={`header-${props.value._key}`}>{props.children}</h3>
  ),
  heading2: (props) => <h4>{props.children}</h4>,
  heading3: (props) => <h5>{props.children}</h5>,
  heading4: (props) => <h6>{props.children}</h6>,
};

const OverviewTab: FC<OverviewTabProps> = (props: OverviewTabProps) => {
  const { curriculumCMSInfo, curriculumInfo, curriculumSelectionSlugs } =
    props.data;
  const {
    curriculumExplainer,
    subjectPrinciples,
    partnerBio,
    curriculumPartner,
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

  // TODO: Add multiple curriculum partners here, see <https://www.notion.so/oaknationalacademy/New-curriculum-partner-design-in-overview-tab-10326cc4e1b180098542eb3b70ba270d>
  const curriculumPartners = isCurricPartnerHackEnabled()
    ? [curriculumPartner, curriculumPartner]
    : [curriculumPartner];

  const h1Headings = (curriculumExplainer.explainerRaw ?? []).filter(
    (block) => {
      return block.style === "heading1";
    },
  );

  const goToAnchor = (selector: string) => {
    document.querySelector(`#header-${selector}`)?.scrollIntoView();
  };

  const partnerTitle = `Our curriculum partner${
    curriculumPartners.length > 1 ? "s" : ""
  }`;

  const subjectIconName = getValidSubjectIconName(subjectSlug);

  const contents = (
    <OakFlex $gap={"space-between-m"} $flexDirection={"column"}>
      <OakP>Contents</OakP>
      <OakFlex $gap={"space-between-xs"} $flexDirection={"column"}>
        {h1Headings.map((heading, headingIndex) => {
          return (
            <OakFlex
              key={heading._key}
              $gap={"space-between-xs"}
              $alignItems="center"
            >
              <OakFlex
                $alignItems="center"
                $justifyContent="center"
                $minWidth="all-spacing-7"
                $minHeight="all-spacing-7"
                $borderRadius="border-radius-circle"
                $background={"black"}
                $color={"white"}
              >
                {headingIndex + 1}
              </OakFlex>
              <OakTertiaryButton onClick={() => goToAnchor(heading._key)}>
                {heading.children[0].text}
              </OakTertiaryButton>
            </OakFlex>
          );
        })}
      </OakFlex>
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
      >
        {isCycleTwoEnabled && (
          <OakFlex $gap={"all-spacing-16"} $alignItems={"flex-start"}>
            <ScreenReaderOnly>
              <OakHeading
                tag="h2"
                $font={["heading-5", "heading-4"]}
                $mb="space-between-m"
                data-testid="overview-heading"
                id="curriculum-overview-heading"
              >
                Overview
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
        {video && videoExplainer && (
          <OakFlex
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
              <OakHeading tag="h3" $font={["heading-6", "heading-5"]}>
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
                <OakHeading tag="h3" $font={["heading-5"]}>
                  {partnerTitle}
                </OakHeading>
              </OakBox>
              <OakFlex
                $gap={["space-between-l", "space-between-m2"]}
                $flexDirection={"column"}
              >
                {curriculumPartners.map(
                  (curriculumPartner, curriculumPartnerIndex) => {
                    return (
                      <OakFlex
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
                              <OakHeading tag="h3" $font={["heading-5"]}>
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
