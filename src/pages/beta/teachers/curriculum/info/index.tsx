// import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { NextPage } from "next";
import { FC } from "react";

// import curriculumApi from "node-lib/curriculum-api";
// import { decorateWithIsr } from "node-lib/isr";
import { BETA_SEO_PROPS } from "browser-lib/seo/Seo";
import AppLayout from "components/AppLayout";
import Box from "components/Box";
import Flex from "components/Flex";
import MaxWidth from "components/MaxWidth/MaxWidth";
import { Heading, P } from "components/Typography";
import Grid, { GridArea } from "components/Grid";
import Button from "components/Button/Button";
import Card from "components/Card/Card";
import DropdownSelect from "components/DropdownSelect";
import ButtonAsLink from "components/Button/ButtonAsLink";
import SubjectIcon from "components/SubjectIcon/SubjectIcon";
import BrushBorders from "components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import AvatarImage from "components/AvatarImage/AvatarImage";
import BoxBorders from "components/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import OakLink from "components/OakLink/OakLink";
import Icon from "components/Icon/Icon";

export type CurriculumInfoPageProps = {
  data: [];
};

const mathsCurriculaDesc =
  "Our curriculum provides adaptable, coherently sequenced units to allow students to develop a deep, sustained understanding of mathematics at Key Stages 1-4. Evidence informed approaches including variation and the development of core sets of models and representations to build pupil knowledge and conceptual understanding. Lessons are designed to be flexible, accessible and to acknowledge the diversity in our schools. Central to the design of our curriculum is coherence in the development of key threads in mathematics. These threads reflect the structure of the National Curriculum, allowing teachers to track the development of key knowledge and skills. Reasoning and problem solving are integral. Resources promote the use of vocabulary allowing pupils to articulate their thinking and strengthen both their procedural knowledge and conceptual understanding. Use of talk allows pupils to explore mathematical connections and use key vocabulary accurately when presenting their reasoning.";

const schoolPhase = [
  { value: "KS1-2", label: "Key Stage 1&2" },
  { value: "KS3-4", label: "Key Stage 3&4" },
  { value: "KS1", label: "Key Stage 1" },
  { value: "KS2", label: "Key Stage 2" },
  { value: "KS3", label: "Key Stage 3" },
  { value: "KS4", label: "Key Stage 4" },
];

// const examBoards = [
//   { value: "AQA", label: "AQA" },
//   { value: "Edexcel", label: "Edexcel" },
//   { value: "OCR", label: "OCR" },
// ];
const subjects = [
  { value: "biology", label: "Biology" },
  { value: "chemistry", label: "Chemistry" },
  { value: "combined-science", label: "Combined Science" },
  { value: "english", label: "English" },
  { value: "geography", label: "Geography" },
  { value: "history", label: "History" },
  { value: "maths", label: "Maths" },
  { value: "music", label: "Music" },
  { value: "physics", label: "Physics" },
  { value: "science", label: "Science" },
];

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = () => {
  return (
    <AppLayout seoProps={BETA_SEO_PROPS} $background={"grey1"}>
      <CurriculaSelection />
      <Flex $background={"grey1"} $justifyContent={"center"} $pv={48}>
        <Box $width={"80%"}>
          <MaxWidth $background={"grey1"}>
            <Flex $background={"grey1"}>
              <Heading tag={"h2"} $font={"heading-light-3"} $mr={26}>
                Secondary Maths
              </Heading>
              <ButtonAsLink
                label={"Get curriculum resources"}
                page={"develop-your-curriculum"}
              />
            </Flex>
          </MaxWidth>
        </Box>
      </Flex>
      <Box $background={"white"}>
        <Box $background={"grey1"}>
          <Flex $width={"80%"} $ma={"auto"}>
            <Button label="Overview" $ml={0} $mb={1} background={"grey1"} />
            <Button label="Units" $ml={12} $mb={1} background={"white"} />
            <Button label="Downloads" $ml={12} $mb={1} background={"white"} />
          </Flex>
        </Box>
        <Box $width={"80%"} $ma={"auto"}>
          <Flex $width={"100%"} $mv={10} $justifyContent={"space-between"}>
            <Box $mv={20} $mr={16}>
              <P>{mathsCurriculaDesc}</P>
            </Box>

            <Card
              $ml={40}
              $height={"100%"}
              $width={"100%"}
              $ma={"auto"}
              $background={"teachersLilac"}
            >
              <BrushBorders color="teachersLilac" />
              <SubjectIcon
                subjectSlug="maths"
                $minWidth={120}
                $background={"teachersLilac"}
              />
            </Card>
          </Flex>
        </Box>

        <Box $maxWidth={"80%"} $ma={"auto"}>
          <h3>Subject principles</h3>
          <Flex $justifyContent={"center"}>
            {[1, 2, 3, 4].map((pointNum) => {
              return (
                <Card
                  $mh={3}
                  $mv={20}
                  $background={"white"}
                  key={`example-curricula-points-${pointNum}`}
                >
                  <BoxBorders />
                  <P>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </P>
                </Card>
              );
            })}
          </Flex>
        </Box>

        <Box $maxWidth={"80%"} $ma={"auto"}>
          <Heading $mv={6} tag="h3">
            Video guide
          </Heading>
          <Flex $justifyContent={"space-around"}>
            <Box $mh={6} $maxWidth={"40%"}>
              <P $mv={6}>
                Our new curriculum sequence has recently launched. For
                additional support, watch this video guide by [Firstname
                Surname] from our educational team, as they talk you through how
                to use this new tool.
              </P>
              <OakLink $color={"black"} $font="heading-7" page={"help"} $mv={6}>
                Read more about our new curriculum
                <Icon name={"chevron-right"} />
              </OakLink>
            </Box>
            <Box $mh={6} $height={300} $width={"100%"} $background={"grey1"}>
              Video here
            </Box>
          </Flex>
        </Box>

        <Card
          $background={"teachersLilac"}
          $width={"80%"}
          $mt={24}
          $ma={"auto"}
        >
          <BrushBorders color="teachersLilac" />
          <Flex $justifyContent={"center"}>
            <AvatarImage $background={"grey1"} $ma={"auto"} $ml={20} $mr={20} />
            <Box>
              <h4>This curriculum was created by [Firstname Surname]</h4>
              <P>
                [Firstname Surname] is a [role] who has had the following
                experience: Aliquam in hendrerit urna. Pellentesque sit amet
                sapien fringilla, mattis ligula consectetur, ultrices mauris.
                Maecenas vitae mattis tellus.
              </P>
            </Box>
          </Flex>
        </Card>
      </Box>
    </AppLayout>
  );
};

// export const getStaticProps: GetStaticProps<
//   CurriculumInfoPageProps
// > = async () => {
//   const data = await curriculumApi.programmeListingPaths();
//   const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
//     props: {
//       data: data,
//     },
//   };
//   const resultsWithIsr = decorateWithIsr(results);
//   return resultsWithIsr;
// };

export default CurriculumInfoPage;

const CurriculaSelection: FC = () => {
  const canViewCurriculum = false;

  function handleYearGroupChange(e: {
    target: { name: string; value: string };
  }): void {
    // TODO: Update subject dropdown options based on year group selection
    console.log(e.target.value);
  }

  function handleSubjectChange(e: {
    target: { name: string; value: string };
  }): void {
    // TODO: Update year groups based on subject selection?
    console.log(e.target.value);
  }

  function handleCurriculumClick(): void {
    // TODO: Navigate to curriculum view based on year group and subject selection
  }

  return (
    <Flex $background={"grey1"} $justifyContent={"center"} $pv={[20]}>
      <MaxWidth>
        <Box $pt={20}>
          <Heading
            $font={"heading-4"}
            tag={"h3"}
            $mb={36}
            $textAlign={"center"}
          >
            Oak's Curricula
          </Heading>
          <Grid>
            <GridArea $colSpan={[12, 5]}>
              <DropdownSelect
                id="subject"
                name={"subject"}
                label={"Subject"}
                placeholder={"Maths"}
                listItems={subjects}
                onChange={handleSubjectChange}
                $mr={[0, 24]}
              />
            </GridArea>
            <GridArea $colSpan={[12, 5]}>
              <DropdownSelect
                id="school-phase"
                name={"school-phase"}
                label={"School Phase"}
                placeholder={"Key Stage 3&4"}
                listItems={schoolPhase}
                onChange={handleYearGroupChange}
                $mr={[0, 24]}
              />
            </GridArea>
            <GridArea $colSpan={[12, 2]}>
              <Button
                label="View"
                disabled={!canViewCurriculum}
                onClick={handleCurriculumClick}
              />
            </GridArea>
          </Grid>
        </Box>
      </MaxWidth>
    </Flex>
  );
};
