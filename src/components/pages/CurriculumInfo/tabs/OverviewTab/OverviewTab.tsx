import { FC } from "react";
import { useRouter } from "next/router";

import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import { Heading, UL, LI } from "@/components/Typography";
import Card from "@/components/Card/Card";
import SubjectIcon from "@/components/SubjectIcon/SubjectIcon";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import AvatarImage from "@/components/AvatarImage/AvatarImage";
import OakLink from "@/components/OakLink/OakLink";
import Icon from "@/components/Icon/Icon";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Typography from "@/components/Typography/Typography";
import { CurriculumOverviewTabData } from "@/node-lib/curriculum-api-2023";

type OverviewTabProps = {
  data: CurriculumOverviewTabData;
};

const OverviewTab: FC<OverviewTabProps> = (props: OverviewTabProps) => {
  const { data } = props;
  const router = useRouter();
  const slug = router.query.subjectPhaseSlug as string;
  const {
    subjectPrinciples,
    curriculaDesc,
    partnerBio,
    videoGuideDesc,
    subjectSlug,
  } = data;
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

      <Card $maxWidth={"100%"} $background={"aqua30"} $zIndex={"neutral"}>
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
                data-testid="subjectPrinciples"
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

      <Box $maxWidth={"100%"} $pt={80} $pb={80}>
        <Flex $justifyContent={"space-around"}>
          <Box $mh={6} $height={300} $width={"100%"} $background={"grey1"}>
            Video here
          </Box>

          <Flex
            $mh={50}
            $ph={50}
            $flexDirection={"column"}
            $justifyContent={"space-between"}
          >
            <Heading $mv={6} tag="h2" $font={["heading-5", "heading-6"]}>
              Video guide
            </Heading>
            <Typography $mv={6} $font={"body-1"}>
              {videoGuideDesc}
            </Typography>
            <OakLink $color={"black"} $font="heading-7" page={"help"} $mv={6}>
              <Flex>
                Read more about our new curriculum
                <Icon name={"chevron-right"} $ml={0} $ma={"auto"} />
              </Flex>
            </OakLink>
            <ButtonAsLink
              variant="brush"
              label="View unit sequence"
              page={null}
              href={`/beta/teachers/curriculum/${slug}/units`}
              $mv={10}
              icon="arrow-right"
              iconBackground="transparent"
              $iconPosition="trailing"
              size="large"
              $maxWidth={"20%"}
            />
          </Flex>
        </Flex>
      </Box>

      <Card $background={"lemon30"} $width={"100%"}>
        <BrushBorders color="lemon30" />
        <Flex $justifyContent={"center"} $pa={16}>
          <AvatarImage $background={"grey1"} $ma={"auto"} $ml={20} $mr={20} />
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
