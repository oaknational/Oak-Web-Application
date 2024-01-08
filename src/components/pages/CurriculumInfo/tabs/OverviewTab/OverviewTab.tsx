import { FC } from "react";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import { P, Heading, UL, LI } from "@/components/Typography";
import Card from "@/components/SharedComponents/Card/Card";
import SubjectIcon from "@/components/SubjectIcon/SubjectIcon";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import Icon from "@/components/Icon/Icon";
import Typography from "@/components/Typography/Typography";
import { CurriculumOverviewMVData } from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { CurriculumSelectionSlugs } from "@/pages/teachers/curriculum/[subjectPhaseSlug]/[tab]";
import CMSImage from "@/components/SharedComponents/CMSImage";
import CMSVideo from "@/components/SharedComponents/CMSVideo";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

export type OverviewTabProps = {
  data: {
    curriculumInfo: CurriculumOverviewMVData;
    curriculumCMSInfo: CurriculumOverviewSanityData;
    curriculumSelectionSlugs: CurriculumSelectionSlugs;
  };
};

const OverviewTab: FC<OverviewTabProps> = (props: OverviewTabProps) => {
  const { curriculumCMSInfo, curriculumInfo, curriculumSelectionSlugs } =
    props.data;
  const {
    subjectPrinciples,
    partnerBio,
    curriculumPartner,
    video,
    videoExplainer,
  } = curriculumCMSInfo;
  const { curriculaDesc } = curriculumInfo;
  const { subjectSlug } = curriculumSelectionSlugs;

  const createBullet = (item: string, i: number) => (
    <LI $mb={[12]} key={`principle-${i + 1}`} data-testid="subject-principles">
      <Flex $alignItems={"flex-start"} $justifyContent={"flex-start"}>
        <Flex
          $background={"mint"}
          $borderRadius={"50%"}
          $borderColor="mint"
          $mr={10}
        >
          <Icon name="arrow-right" $ma={"auto"} $pa={2} />
        </Flex>
        {item}
      </Flex>
    </LI>
  );
  const itemiseSubjectPrinciples = (item: string, i: number) => {
    if (item.includes(" • ")) {
      const sublist = item.split(" • ");
      if (sublist.length > 0 && typeof sublist[0] === "string") {
        const firstItem = sublist[0];
        const bulletItems = sublist.slice(1);
        const bullets = bulletItems.map((listItem, li) => (
          <LI
            listStyle={"disc"}
            data-testid="sp-subbullet"
            key={`${firstItem.split(" ").join("-")}-sb-${li}`}
            $ml={10}
            $mt={4}
            $mb={6}
          >
            {listItem}
          </LI>
        ));
        return (
          <LI $mb={10} key={`${firstItem.split(" ").join("-")}`}>
            {createBullet(firstItem, i)}
            <UL>{bullets}</UL>
          </LI>
        );
      }
    } else {
      return createBullet(item, i);
    }
  };
  return (
    <Box $maxWidth={1280} $mh={"auto"} $ph={18} $width={"100%"}>
      <Flex $mb={10}>
        <Box
          $mr={16}
          $pb={48}
          $maxWidth={["100%", "100%", "65%"]}
          $textAlign={"left"}
        >
          <Heading tag="h2" $font={["heading-5", "heading-4"]} $mb={24}>
            Overview
          </Heading>
          <Heading
            tag="h3"
            $font={["heading-6", "heading-5"]}
            data-testid="intent-heading"
            $mb={20}
            line-height={48}
          >
            Curriculum explainer
          </Heading>
          <Typography
            $font={["body-2", "body-1"]}
            style={{ fontWeight: "light" }}
            $mt={10}
            $mr={12}
            $whiteSpace={"break-spaces"}
          >
            {curriculaDesc}
          </Typography>
        </Box>

        <Card
          $ml={40}
          $maxHeight={200}
          $maxWidth={[0, 0, 200]}
          $ma={"auto"}
          $zIndex={"inFront"}
          $transform={["rotate(-2.179deg) scale(1.5, 1.5) translate(15%,40%)"]}
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
      </Flex>
      <Card
        $maxWidth={"100%"}
        $background={"mint30"}
        $zIndex={"neutral"}
        $mb={80}
      >
        <BrushBorders color={"mint30"} />
        <Box $ma={16}>
          <Heading tag="h3" $font={["heading-6", "heading-5"]}>
            Subject principles
          </Heading>
          <UL $font={["body-2", "body-1"]} $mt={24} $reset={true}>
            {subjectPrinciples.map((item, i) =>
              itemiseSubjectPrinciples(item, i),
            )}
          </UL>
        </Box>
      </Card>
      {video && videoExplainer && (
        <Flex
          $alignItems={"center"}
          $justifyContent={"flex-start"}
          $flexDirection={["column-reverse", "row"]}
          $gap={[24, 120]}
          $mb={[48, 80]}
        >
          <Box $minWidth={["100%", "50%"]} $maxWidth={["100%", "50%"]}>
            <CMSVideo video={video} location="lesson" />
          </Box>
          <Flex
            $flexDirection={"column"}
            $maxWidth={["100%", "30%"]}
            $alignItems={"flex-start"}
            $gap={[16, 24]}
          >
            <Heading tag="h3" $font={["heading-6", "heading-5"]}>
              Video guide
            </Heading>
            <P $font={"body-1"}>{videoExplainer}</P>
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
        </Flex>
      )}
      <Card $background={"lemon30"} $width={"100%"} $mb={[36, 48]}>
        <BrushBorders color="lemon30" />
        <Flex
          $justifyContent={"center"}
          $alignItems={"center"}
          $pa={16}
          $flexDirection={["column", "row"]}
          $gap={[16, 32]}
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
            <Heading tag="h3" $font={["heading-6", "heading-5"]} $mb={20}>
              Our curriculum partner
            </Heading>
            <Typography $font={"body-1"}>{partnerBio}</Typography>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
};
export default OverviewTab;
