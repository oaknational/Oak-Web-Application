import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { BETA_SEO_PROPS } from "browser-lib/seo/Seo";
import AppLayout from "components/AppLayout";
import Box from "components/Box";
import Flex from "components/Flex";
import MaxWidth from "components/MaxWidth/MaxWidth";
import { Heading, UL, LI, P } from "components/Typography";
import Grid, { GridArea } from "components/Grid";
import Card from "components/Card/Card";
import CardLink from "components/Card/CardLink";
import SubjectPhasePicker, {
  SubjectPhaseOptions,
} from "components/SubjectPhasePicker/SubjectPhasePicker";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "node-lib/isr";
import { VIEW_TYPES, ViewType } from "common-lib/urls";

export type CurriculumHomePageProps = {
  subjectPhaseOptions: SubjectPhaseOptions;
};

const CurriculumHomePage: NextPage<CurriculumHomePageProps> = (props) => {
  const { subjectPhaseOptions } = props;

  return (
    <AppLayout seoProps={BETA_SEO_PROPS} $background={"grey1"}>
      <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
        <MaxWidth>
          <Box $ph={[16, 0]} $pb={[18, 48, 48]}>
            <Heading
              $font={["heading-5", "heading-4"]}
              tag={"h1"}
              $mt={120}
              $color={"black"}
            >
              Curriculum Resources
            </Heading>
            <Heading $font={"heading-light-6"} tag={"h2"} $mv={8}>
              A collection of high quality resources to support you, whether
              you're looking for exemplars or help with starting from scratch.
            </Heading>
          </Box>
        </MaxWidth>
      </Flex>
      <Flex $background={"white"} $pv={[48]}>
        <MaxWidth>
          <Box $ph={[16, 0]} $pb={[24]}>
            <Heading tag={"h2"} $font={"heading-light-6"} $mb={16}>
              Oak's Curricula
            </Heading>
            <SubjectPhasePicker {...subjectPhaseOptions} />
          </Box>
        </MaxWidth>
      </Flex>
      <Flex
        $background={"teachersPastelYellow"}
        $justifyContent={"center"}
        $pv={[48]}
      >
        <MaxWidth>
          <Box $ph={[16, 0]} $pb={[24, 48]}>
            <Heading tag={"h2"} $font={"heading-light-6"} $mb={16}>
              How we approach curriculum design
            </Heading>
            <P $mb={[24]}>
              Every school's approach to curriculum design is different, but it
              can be helpful to see examples to inspire your own. Explore our
              curriculum maps to learn about the six curriculum principles that
              guide our lesson and curriculum design. See how we’ve approached:
            </P>
            <UL $reset={true} $mb={[24]}>
              <LI $mb={[10]}>
                Sequencing subject key stage units, including alternative
                sequences
              </LI>
              <LI $mb={[10]}>Summarising the core content pupils will learn</LI>
              <LI $mb={[10]}>
                Identifying lesson specific content (varies by subject)
                including: lesson vocabulary, equipment requirements and
                disciplinary knowledge
              </LI>
            </UL>
          </Box>
          <Box $ph={[16, 0]} $pb={[24, 48]}>
            <Heading tag={"h2"} $font={"heading-light-6"} $mb={16}>
              Our blogs about curriculum design
            </Heading>
            <Grid>
              <GridArea $colSpan={[12, 4]}>
                <Card
                  $background="teachersPastelBlue"
                  $pa={[24]}
                  $height={[150]}
                  $mr={[0, 16]}
                >
                  <CardLink
                    page="blog-single"
                    blogSlug="tbd-link-to-relevant-page"
                  >
                    <Heading tag={"h3"} $font={"heading-light-7"} $mb={16}>
                      Resource
                    </Heading>
                    <P>Download our skeleton curriculum template</P>
                  </CardLink>
                </Card>
              </GridArea>
              <GridArea $colSpan={[12, 4]}>
                <Card
                  $background="teachersPastelBlue"
                  $pa={[24]}
                  $height={[150]}
                  $mr={[0, 16]}
                >
                  <CardLink
                    page="blog-single"
                    blogSlug="tbd-link-to-relevant-page"
                  >
                    <Heading tag={"h3"} $font={"heading-light-7"} $mb={16}>
                      Blog
                    </Heading>
                    <P>How to design a subject curriculum</P>
                  </CardLink>
                </Card>
              </GridArea>
              <GridArea $colSpan={[12, 4]}>
                <Card
                  $background="teachersPastelBlue"
                  $pa={[24]}
                  $height={[96]}
                >
                  <CardLink
                    page="blog-single"
                    blogSlug="tbd-link-to-relevant-page"
                  >
                    <Heading tag={"h3"} $font={"heading-light-7"} $mb={16}>
                      Resource
                    </Heading>
                    <P>How to design a unit of study</P>
                  </CardLink>
                </Card>
              </GridArea>
            </Grid>
          </Box>
        </MaxWidth>
      </Flex>
    </AppLayout>
  );
};

type URLParams = {
  viewType: ViewType;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const paths = VIEW_TYPES.map((viewType) => ({
    params: { viewType },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
  };
  return config;
};

export const fetchSubjectPhaseOptions: () => Promise<SubjectPhaseOptions> =
  async () => {
    // Hardcoded data
    return {
      newSubjects: [
        {
          title: "English",
          slug: "english",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
          examboards: [
            { title: "AQA", slug: "aqa" },
            { title: "Edexcel", slug: "edexcel" },
          ],
        },
        {
          title: "Combined Science",
          slug: "combined-science",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
        {
          title: "Geography",
          slug: "geography",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "History",
          slug: "history",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
          examboards: [
            { title: "AQA", slug: "aqa" },
            { title: "Edexcel", slug: "edexcel" },
          ],
        },
        {
          title: "Maths",
          slug: "maths",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Music",
          slug: "music",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
        {
          title: "Science",
          slug: "science",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Biology",
          slug: "biology",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
        {
          title: "Physics",
          slug: "physics",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
        {
          title: "Chemistry",
          slug: "chemistry",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
      ],
      legacySubjects: [
        {
          title: "Art & Design",
          slug: "art",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Citizenship",
          slug: "citizenship",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
        {
          title: "Computing",
          slug: "computing",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Design & Technology",
          slug: "design-technology",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Drama",
          slug: "drama",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "English",
          slug: "english",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "French",
          slug: "french",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Geography",
          slug: "geography",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "German",
          slug: "german",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
        {
          title: "History",
          slug: "history",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Latin",
          slug: "latin",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
        {
          title: "Maths",
          slug: "maths",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Music",
          slug: "music",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Physical Education",
          slug: "physical-education",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Physics",
          slug: "physics",
          phases: [{ title: "Secondary", slug: "secondary" }],
        },
        {
          title: "Religious Education",
          slug: "religious-education",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "RSHE (PSHE)",
          slug: "rshe-pshe",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Science",
          slug: "science",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
        {
          title: "Spanish",
          slug: "spanish",
          phases: [
            { title: "Primary", slug: "primary" },
            { title: "Secondary", slug: "secondary" },
          ],
        },
      ],
    };
  };

export const getStaticProps: GetStaticProps<
  CurriculumHomePageProps
> = async () => {
  const data = await fetchSubjectPhaseOptions();
  const results: GetStaticPropsResult<CurriculumHomePageProps> = {
    props: {
      subjectPhaseOptions: data,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default CurriculumHomePage;
