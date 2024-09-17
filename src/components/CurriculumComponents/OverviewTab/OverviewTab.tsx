import { FC } from "react";
import {
  OakP,
  OakHeading,
  OakUL,
  OakLI,
  OakTypography,
  OakFlex,
} from "@oaknational/oak-components";
import {
  PortableText,
  PortableTextBlockComponent,
  PortableTextComponents,
} from "@portabletext/react";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Card from "@/components/SharedComponents/Card/Card";
import SubjectIcon from "@/components/SharedComponents/SubjectIcon/SubjectIcon";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import Icon from "@/components/SharedComponents/Icon";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import CMSImage from "@/components/SharedComponents/CMSImage";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { basePortableTextComponents } from "@/components/SharedComponents/PortableText";
import { ENABLE_CYCLE_2 } from "@/utils/curriculum/constants";

export type OverviewTabProps = {
  data: {
    curriculumInfo: CurriculumOverviewMVData;
    curriculumCMSInfo: CurriculumOverviewSanityData;
    curriculumSelectionSlugs: CurriculumSelectionSlugs;
  };
};

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
  heading2: (props) => <OakHeading tag="h2">{props.children}</OakHeading>,
  heading3: (props) => <OakHeading tag="h3">{props.children}</OakHeading>,
  heading4: (props) => <OakHeading tag="h4">{props.children}</OakHeading>,
};

const OverviewTab: FC<OverviewTabProps> = (props: OverviewTabProps) => {
  const { curriculumCMSInfo, curriculumInfo, curriculumSelectionSlugs } =
    props.data;
  const {
    curriculumExplainerRaw,
    subjectPrinciples,
    partnerBio,
    curriculumPartner,
    video,
    videoExplainer,
  } = curriculumCMSInfo;
  const { curriculaDesc } = curriculumInfo;
  const { subjectSlug } = curriculumSelectionSlugs;

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
  return (
    <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
      {ENABLE_CYCLE_2 && (
        <OakFlex $mb="space-between-ssx">
          <Box
            $mr={16}
            $pb={48}
            $maxWidth={["100%", "100%", "65%"]}
            $textAlign={"left"}
          >
            <OakHeading
              tag="h2"
              $font={["heading-5", "heading-4"]}
              $mb="space-between-m"
            >
              Overview
            </OakHeading>
            <OakP>
              <PortableText
                value={curriculumExplainerRaw}
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
            </OakP>
          </Box>
        </OakFlex>
      )}
      {!ENABLE_CYCLE_2 && (
        <>
          <OakFlex $mb="space-between-ssx">
            <Box
              $mr={16}
              $pb={48}
              $maxWidth={["100%", "100%", "65%"]}
              $textAlign={"left"}
            >
              <OakHeading
                tag="h2"
                $font={["heading-5", "heading-4"]}
                $mb="space-between-m"
              >
                Overview
              </OakHeading>
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
              $maxHeight={200}
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
              <SubjectIcon
                subjectSlug={subjectSlug}
                $maxHeight={200}
                $maxWidth={200}
                $transform={["rotate(-2.179deg)", "scale(1.25, 1.25)"]}
                $background={"lemon50"}
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
              Our curriculum partner
            </OakHeading>
            <OakTypography $font={"body-1"}>{partnerBio}</OakTypography>
          </Box>
        </OakFlex>
      </Card>
    </Box>
  );
};
export default OverviewTab;
