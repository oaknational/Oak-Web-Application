import { FC } from "react";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import { Heading, UL, LI } from "@/components/Typography";
import Card from "@/components/Card/Card";
import SubjectIcon from "@/components/SubjectIcon/SubjectIcon";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import AvatarImage from "@/components/AvatarImage/AvatarImage";
import Icon from "@/components/Icon/Icon";
import Typography from "@/components/Typography/Typography";
import { CurriculumOverviewTabData } from "@/node-lib/curriculum-api-2023";
import { CurriculumOverviewSanityData } from "@/common-lib/cms-types";
import { CurriculumSelectionSlugs } from "@/pages/beta/[viewType]/curriculum/[subjectPhaseSlug]/[tab]";

export type OverviewTabProps = {
  data: {
    curriculumInfo: CurriculumOverviewTabData;
    curriculumCMSInfo: CurriculumOverviewSanityData;
    curriculumSelectionSlugs: CurriculumSelectionSlugs;
  };
};

const OverviewTab: FC<OverviewTabProps> = (props: OverviewTabProps) => {
  const { curriculumCMSInfo, curriculumInfo, curriculumSelectionSlugs } =
    props.data;
  const { subjectPrinciples, partnerBio, curriculumPartner } =
    curriculumCMSInfo;
  const { curriculaDesc } = curriculumInfo;
  const { subjectSlug } = curriculumSelectionSlugs;
  return (
    <Box $width={"80%"} $ma={"auto"} $pb={80}>
      <Flex $width={"100%"} $mv={10} $justifyContent={"space-around"}>
        <Box
          $pt={20}
          $mr={16}
          $pb={48}
          $maxWidth={["100%", "65%"]}
          $textAlign={"left"}
        >
          <Heading
            tag="h2"
            $font={["heading-5", "heading-6"]}
            data-testid="intent-heading"
          >
            Curriculum intent
          </Heading>
          <Typography
            $font={["body-2", "body-1"]}
            style={{ fontWeight: "light" }}
            $mt={10}
            $mr={12}
          >
            {curriculaDesc}
          </Typography>
        </Box>

        <Card
          $ml={40}
          $maxHeight={200}
          $maxWidth={["100%", 200]}
          $ma={"auto"}
          $zIndex={"inFront"}
          $transform={["rotate(-2.179deg) scale(1.5, 1.5) translate(15%,40%)"]}
          $display={["none", "flex"]}
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
        $background={"aqua30"}
        $zIndex={"neutral"}
        $mb={80}
      >
        <BrushBorders color={"aqua30"} />
        <Box $ma={16}>
          <Heading tag="h2" $font={["heading-5", "heading-6"]}>
            Subject principles
          </Heading>
          <UL $reset={true} $mt={24}>
            {subjectPrinciples.map((item, i) => (
              <LI
                $mb={[12]}
                key={`principle-${i + 1}`}
                data-testid="subject-principles"
              >
                <Flex $alignItems={"center"}>
                  <Flex
                    $background={"aqua"}
                    $borderRadius={"50%"}
                    $borderColor="aqua"
                    $mt={[4]}
                    $mr={10}
                    $pa={1}
                  >
                    <Icon name="arrow-right" $ma={"auto"} $pa={2} />
                  </Flex>
                  {item}
                </Flex>
              </LI>
            ))}
          </UL>
        </Box>
      </Card>

      <Card $background={"lemon30"} $width={"100%"}>
        <BrushBorders color="lemon30" />
        <Flex $justifyContent={"center"} $pa={16}>
          <AvatarImage
            $background={"grey1"}
            $ma={"auto"}
            $ml={20}
            $mr={20}
            image={curriculumPartner.image}
          />
          <Box>
            <Heading tag="h2" $font={"heading-5"}>
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
