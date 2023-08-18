import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/AppLayout";
import Box from "@/components/Box";
import Flex from "@/components/Flex";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import { Heading, UL, LI, P } from "@/components/Typography";
import Grid, { GridArea } from "@/components/Grid";
import Card from "@/components/Card/Card";
import CardLink from "@/components/Card/CardLink";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { ViewType } from "@/common-lib/urls";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export type CurriculumHomePageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
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

export type URLParams = {
  viewType: ViewType;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths: [],
  };
  return config;
};

export const fetchSubjectPhasePickerData: () => Promise<SubjectPhasePickerData> =
  async () => {
    const newSubjects = await curriculumApi2023.subjectPhaseOptions();
    // Legacy data is hardcoded
    const legacySubjects: [string, string, boolean][] = [
      ["Art & Design", "art", true],
      ["Citizenship", "citizenship", false],
      ["Computing", "computing", true],
      ["Design & Technology", "design-technology", true],
      ["Drama", "drama", true],
      ["English", "english", true],
      ["French", "french", true],
      ["Geography", "geography", true],
      ["German", "german", false],
      ["History", "history", true],
      ["Latin", "latin", false],
      ["Maths", "maths", true],
      ["Music", "music", true],
      ["Physical Education", "physical-education", true],
      ["Physics", "physics", false],
      ["Religious Education", "religious-education", true],
      ["RSHE (PSHE)", "rshe-pshe", true],
      ["Science", "science", true],
      ["Spanish", "spanish", true],
    ];

    const phases = [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ];

    return {
      newSubjects: newSubjects,
      legacySubjects: legacySubjects.map((subject) => {
        return {
          title: subject[0],
          slug: subject[1],
          phases: subject[2] ? phases : phases.slice(1),
        };
      }),
    };
  };

export const getStaticProps: GetStaticProps<
  CurriculumHomePageProps
> = async () => {
  const data = await fetchSubjectPhasePickerData();
  const results: GetStaticPropsResult<CurriculumHomePageProps> = {
    props: {
      subjectPhaseOptions: data,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default CurriculumHomePage;
