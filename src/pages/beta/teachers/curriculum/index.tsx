import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import { BETA_SEO_PROPS } from "browser-lib/seo/Seo";
import AppLayout from "components/AppLayout";
import Box from "components/Box";
import Flex from "components/Flex";
import MaxWidth from "components/MaxWidth/MaxWidth";
import { Heading, UL, LI, P } from "components/Typography";
import OakLink from "components/OakLink";
import curriculumApi, { CurriculumHomePageData } from "node-lib/curriculum-api";
import { decorateWithIsr } from "node-lib/isr";
import Icon from "components/Icon";
import Grid, { GridArea } from "components/Grid";
import Button from "components/Button/Button";
import Card from "components/Card/Card";
import CardLink from "components/Card/CardLink";
import DropdownSelect from "components/DropdownSelect";

export type CurriculumHomePageProps = {
  data: CurriculumHomePageData;
};

const CurriculumHomePage: NextPage<CurriculumHomePageProps> = (props) => {
  const { data } = props;
  console.log(data);

  const yearGroups = [
    { value: "1-6", label: "All Primary" },
    { value: "7-12", label: "All Secondary" },
    { value: "1", label: "Year 1" },
    { value: "2", label: "Year 2" },
    { value: "3", label: "Year 3" },
    { value: "4", label: "Year 4" },
    { value: "5", label: "Year 5" },
    { value: "6", label: "Year 6" },
    { value: "7", label: "Year 7" },
    { value: "8", label: "Year 8" },
    { value: "9", label: "Year 9" },
    { value: "10", label: "Year 10" },
    { value: "11", label: "Year 11" },
    { value: "12", label: "Year 12" },
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
      <Flex
        $background={"teachersPastelYellow"}
        $justifyContent={"center"}
        $pv={[48]}
      >
        <MaxWidth>
          <Box $ph={[16, 0]} $pb={[24, 48]}>
            <Heading $font={"heading-light-6"} tag={"h2"} $mb={16}>
              Oak's Curricula
            </Heading>
            <UL $reset={true} $mb={[24]}>
              {[
                "Free",
                "Fully sequenced",
                "Aligned to the National Curriculum",
                "Downloadable & adaptable resources",
                "Created by teachers, for teachers",
              ].map((item) => (
                <LI $mb={[10]}>
                  <Icon name="tick" $top={[4]} />
                  {item}
                </LI>
              ))}
            </UL>
            <OakLink page={"blog-single"} blogSlug="tbd-link-to-relevant-post">
              See more about our research & approach
              <Icon name="chevron-right" $top={[6]} />
            </OakLink>
          </Box>
          <Box $background={"teachersPastelBlue"} $pa={[44]} $borderRadius={8}>
            <Heading $font={"heading-7"} tag={"h3"} $mb={36}>
              Browse our curriculum:
            </Heading>
            <Grid>
              <GridArea $mb={[24, 0]} $colSpan={[12, 5]}>
                <DropdownSelect
                  id="year-group"
                  name={"year-group"}
                  label={"Year Group"}
                  placeholder={"Select a year group..."}
                  listItems={yearGroups}
                  // error={dynamicErrorMessage}
                  onChange={handleYearGroupChange}
                  $mr={[0, 24]}
                />
              </GridArea>

              <GridArea $mb={[24, 0]} $colSpan={[12, 5]}>
                <DropdownSelect
                  id="subject"
                  name={"subject"}
                  label={"Subject"}
                  placeholder={"Select a subject..."}
                  listItems={subjects}
                  // error={dynamicErrorMessage}
                  onChange={handleSubjectChange}
                  $mr={[0, 24]}
                />
              </GridArea>

              <GridArea $colSpan={[12, 2]}>
                <Button
                  label="View curriculum"
                  disabled={!canViewCurriculum}
                  onClick={handleCurriculumClick}
                />
              </GridArea>
            </Grid>
          </Box>
        </MaxWidth>
      </Flex>

      <Flex
        $background={"pupilsLightGreen"}
        $justifyContent={"center"}
        $pv={[48]}
      >
        <MaxWidth>
          <Box $ph={[16, 0]} $pb={[24, 48]}>
            <Heading tag={"h2"} $font={"heading-light-6"} $mb={16}>
              Starting your curriculum from scratch?
            </Heading>
            <P $mb={[24]}>
              Browse how-to's, video explainers and resources to support you
              with the development of your curriculum, whether you're designing
              a subject curriculum or unit of study.
            </P>
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

export const getStaticProps: GetStaticProps<
  CurriculumHomePageProps
> = async () => {
  const data = await curriculumApi.curriculumHomePage();
  const results: GetStaticPropsResult<CurriculumHomePageProps> = {
    props: {
      data: data,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default CurriculumHomePage;
