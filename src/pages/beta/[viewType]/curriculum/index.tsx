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
import { Heading, UL, LI, P, Hr } from "@/components/Typography";
import Grid, { GridArea } from "@/components/Grid";
import Card from "@/components/Card/Card";
import CardLink from "@/components/Card/CardLink";
import { SubjectPhasePickerData } from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import { ViewType } from "@/common-lib/urls";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import CurriculumLandingHero from "@/components/pages/LandingPages/CurriculumLandingHero";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";

export type CurriculumHomePageProps = {
  subjectPhaseOptions: SubjectPhasePickerData;
};

const CurriculumHomePage: NextPage<CurriculumHomePageProps> = (props) => {
  const { subjectPhaseOptions } = props;

  return (
    <AppLayout seoProps={BETA_SEO_PROPS} $background={"grey1"}>
      <Flex $justifyContent={"center"} $background={"mint"}>
        <MaxWidth $ph={16}>
          <Box $mt={20}>
            <Breadcrumbs
              breadcrumbs={[
                {
                  oakLinkProps: { page: "home", viewType: "teachers-2023" },
                  label: "Home",
                },
                {
                  oakLinkProps: {
                    page: "curriculum-landing-page",
                    viewType: "teachers-2023",
                  },
                  label: "Curriculum resources",
                },
              ]}
            />
            <Hr $color={"white"} $mb={0} />
          </Box>
          <Flex $mt={[24, 80]} $mb={[80]}>
            <CurriculumLandingHero subjectPhaseOptions={subjectPhaseOptions} />
          </Flex>
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
    const subjects = await curriculumApi2023.subjectPhaseOptions();
    return {
      subjects: subjects,
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
