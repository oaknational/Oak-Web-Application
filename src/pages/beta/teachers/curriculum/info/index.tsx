// import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { NextPage } from "next";
import { FC } from "react";

// import curriculumApi from "node-lib/curriculum-api";
// import { decorateWithIsr } from "node-lib/isr";
import { BETA_SEO_PROPS } from "browser-lib/seo/Seo";
import AppLayout from "components/AppLayout";
import Box from "components/Box";
import Flex from "components/Flex";
import { Heading, Hr, UL, LI } from "components/Typography";
import Grid, { GridArea } from "components/Grid";
import Button from "components/Button/Button";
import Card from "components/Card/Card";
import DropdownSelect from "components/DropdownSelect";
import SubjectIcon from "components/SubjectIcon/SubjectIcon";
import BrushBorders from "components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import AvatarImage from "components/AvatarImage/AvatarImage";
import OakLink from "components/OakLink/OakLink";
import Icon from "components/Icon/Icon";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs";
import TabularNav from "components/TabularNav/TabularNav";
import IconButton from "components/Button/IconButton";
import ButtonAsLink from "components/Button/ButtonAsLink";
import Typography from "components/Typography/Typography";

export type CurriculumInfoPageProps = {
  data: [];
};

const curriculaDesc =
  "Our curriculum provides adaptable, coherently sequenced units to allow students to develop a deep, sustained understanding of mathematics at Key Stages 1-4. Evidence informed approaches including variation and the development of core sets of models and representations to build pupil knowledge and conceptual understanding. Lessons are designed to be flexible, accessible and to acknowledge the diversity in our schools. Central to the design of our curriculum is coherence in the development of key threads in mathematics. These threads reflect the structure of the National Curriculum, allowing teachers to track the development of key knowledge and skills. Reasoning and problem solving are integral. Resources promote the use of vocabulary allowing pupils to articulate their thinking and strengthen both their procedural knowledge and conceptual understanding. Use of talk allows pupils to explore mathematical connections and use key vocabulary accurately when presenting their reasoning.";

const subjectPrinciples = [
  "Pairing procedural knowledge with conceptual understanding",
  "Aligning with the Concrete Pictorial Abstract approach to mathematics teaching and learning",
  "Use an agreed set of models and representations which bridge mathematical concepts",
  "Use of variation theory in practice tasks and modelling",
];

const schoolPhase = [
  { value: "KS1-2", label: "Key Stage 1&2" },
  { value: "KS3-4", label: "Key Stage 3&4" },
  { value: "KS1", label: "Key Stage 1" },
  { value: "KS2", label: "Key Stage 2" },
  { value: "KS3", label: "Key Stage 3" },
  { value: "KS4", label: "Key Stage 4" },
];

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
    <AppLayout
      seoProps={BETA_SEO_PROPS}
      $background={"white"}
      headerVariant="landing-pages"
    >
      <CurriculaSelection />
      <Box $background={"aqua50"}>
        <Flex $justifyContent={"center"} $pv={32}>
          <Box $width={"80%"}>
            <Flex $alignItems={"center"} $justifyContent={"left"}>
              <Box $background={"aqua"} $borderRadius={6} $mr={12}>
                <SubjectIcon
                  subjectSlug="maths"
                  $maxHeight={56}
                  $maxWidth={56}
                  $color="white"
                  $borderColor="white"
                />
              </Box>

              <Heading tag={"h2"} $font={"heading-light-3"} $mr={26}>
                Secondary Maths
              </Heading>
            </Flex>
          </Box>
        </Flex>
        <TabularNav
          $width={"80%"}
          $ma={"auto"}
          label="Curriculum Selection"
          links={[
            {
              href: "/beta/teachers/curriculum/info",
              label: "Overview",
              page: null,
            },
            {
              href: "/beta/teachers/curriculum/info",
              label: "Unit sequence",
              page: null,
            },
            {
              href: "/beta/teachers/curriculum/info",
              label: "Downloads",
              page: null,
            },
          ]}
          onClick={() => null}
        />
      </Box>

      <Box $background={"white"}>
        <Box $width={"80%"} $ma={"auto"} $pb={80}>
          <Flex $width={"100%"} $mv={10} $justifyContent={"space-around"}>
            <Box $pt={20} $mr={16} $maxWidth={"70%"} $textAlign={"justify"}>
              <Heading tag="h5" $font={["heading-5", "heading-6"]}>
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
              $maxWidth={200}
              $ma={"auto"}
              $zIndex={"inFront"}
              $transform={[
                "rotate(-2.179deg) scale(1.5, 1.5) translate(5%,55%)",
              ]}
              $background={"lemon50"}
            >
              <BrushBorders color="lemon50" />
              <SubjectIcon
                subjectSlug="maths"
                $maxHeight={200}
                $maxWidth={200}
                $transform={["rotate(-2.179deg)", "scale(1.25, 1.25)"]}
                $background={"lemon50"}
              />
            </Card>
          </Flex>
        </Box>

        <Card $maxWidth={"80%"} $ma={"auto"} $background={"aqua30"}>
          <BrushBorders color={"aqua30"} />
          <Heading tag="h5" $font={["heading-5", "heading-6"]}>
            Subject principles
          </Heading>
          <UL $reset={true} $mt={10}>
            {subjectPrinciples.map((item) => (
              <LI $mb={[12]}>
                <Flex $alignItems={"center"}>
                  <IconButton
                    icon="arrow-right"
                    disabled={true}
                    $mt={[4]}
                    background={"grey1"}
                    aria-label="pointer to subject principles"
                    $mr={4}
                  />
                  {item}
                </Flex>
              </LI>
            ))}
          </UL>
        </Card>

        <Box $maxWidth={"80%"} $ma={"auto"} $pt={80} $pb={80}>
          <Flex $justifyContent={"space-around"}>
            <Box $mh={6} $height={300} $width={"100%"} $background={"grey1"}>
              Video here
            </Box>
            <Box $mh={6} $ph={50}>
              <Heading $mv={6} tag="h3">
                Video guide
              </Heading>
              <Typography $mv={6} $font={"body-1"}>
                Our new curriculum sequence has recently launched. For
                additional support, watch this video guide by [Firstname
                Surname] from our educational team, as they talk you through how
                to use this new tool.
              </Typography>
              <Flex>
                <OakLink
                  $color={"black"}
                  $font="heading-7"
                  page={"help"}
                  $mv={6}
                >
                  Read more about our new curriculum
                  <Icon name={"chevron-right"} />
                </OakLink>
              </Flex>
              <ButtonAsLink
                variant="brush"
                label="View unit sequence"
                page="search"
                viewType="teachers"
                $mv={10}
              />
            </Box>
          </Flex>
        </Box>

        <Card $background={"lemon30"} $width={"80%"} $ma={"auto"}>
          <BrushBorders color="lemon30" />
          <Flex $justifyContent={"center"}>
            <AvatarImage $background={"grey1"} $ma={"auto"} $ml={20} $mr={20} />
            <Box>
              <Heading tag="h5" $font={"heading-5"}>
                Our curriculum partner
              </Heading>
              <Typography $font={"body-1"}>
                Mathematics in Education and Industry (MEI) is an established
                charity and curriculum development body. Their primary aims are
                to raise the quality of maths education and promote the
                relevance of maths education to everyone. MEI are highly
                respected and are well connected with other quality assured
                organisations, including being a key partner in the NCETM, and
                are well known in schools for their excellent training and
                support programmes.
              </Typography>
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
    <Flex $background={"aqua"} $justifyContent={"center"} $pv={[20]}>
      <Box $width={"80%"}>
        <Breadcrumbs
          breadcrumbs={[
            {
              oakLinkProps: {
                page: "home",
                viewType: "teachers",
              },
              label: "Home",
            },
            {
              oakLinkProps: {
                page: "home",
                viewType: "teachers",
              },
              label: "Curriculum resource",
            },
            {
              oakLinkProps: {
                page: "home",
                viewType: "teachers",
              },
              label: "Secondary English",
            },
          ]}
        />
        <Hr $color={"white"} />
        <Box $pt={10}>
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
      </Box>
    </Flex>
  );
};
