import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";

import curriculumApi, { ProgrammeListingPaths } from "node-lib/curriculum-api";
import { decorateWithIsr } from "node-lib/isr";
import { BETA_SEO_PROPS } from "browser-lib/seo/Seo";
import AppLayout from "components/AppLayout";
import Box from "components/Box";
import Flex from "components/Flex";
import MaxWidth from "components/MaxWidth/MaxWidth";
import { Heading, P } from "components/Typography";
import Grid, { GridArea } from "components/Grid";
import Button from "components/Button/Button";
import OakLink from "components/OakLink";
import Icon from "components/Icon";
import Card from "components/Card/Card";
import DropdownSelect from "components/DropdownSelect";

export type ProgrammeHomePageProps = {
  data: ProgrammeListingPaths;
};

const ProgrammeHomePage: NextPage<ProgrammeHomePageProps> = (props) => {
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

  const threadListSelectItems = [
    { value: "algebra", label: "Algebra" },
    { value: "numbers", label: "Numbers" },
  ];

  const learningTierSelectItems = [
    { value: "core", label: "Core" },
    { value: "foundation", label: "Foundation" },
  ];

  function handleThreadSelectChange(e: {
    target: { name: string; value: string };
  }): void {
    console.log(e.target.value);
  }

  function handleLearningTierSelectChange(e: {
    target: { name: string; value: string };
  }): void {
    console.log(e.target.value);
  }

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
      <Flex $background={"white"} $justifyContent={"center"} $pv={[20]}>
        <MaxWidth>
          <Box $background={"white"} $pa={[44]} $borderRadius={0}>
            <Heading
              $font={"heading-4"}
              tag={"h3"}
              $mb={36}
              $textAlign={"center"}
            >
              Oak's Curriculum
            </Heading>
            <Grid>
              <GridArea $mb={[24, 0]} $colSpan={[12, 5]}>
                <DropdownSelect
                  id="year-group"
                  name={"year-group"}
                  label={"Year Group"}
                  placeholder={"Year 10"}
                  listItems={yearGroups}
                  onChange={handleYearGroupChange}
                  $mr={[0, 24]}
                />
              </GridArea>

              <GridArea $mb={[24, 0]} $colSpan={[12, 5]}>
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
            <Heading tag={"h2"} $font={"heading-light-3"} $mb={16}>
              Maths, Year 10
            </Heading>
            <P $mb={[24]}>Maths programme description. Lorem ipsum...</P>
            <Grid>
              <GridArea $mb={[24, 0]} $colSpan={[10, 3]}>
                <DropdownSelect
                  id="thread"
                  name="threadSelect"
                  label="Thread"
                  placeholder={"Algebra"}
                  listItems={threadListSelectItems}
                  onChange={handleThreadSelectChange}
                  $mr={[0, 24]}
                />
              </GridArea>
              <GridArea $mb={[24, 0]} $colSpan={[10, 3]}>
                <DropdownSelect
                  id="learningTier"
                  name="learningTierSelect"
                  label="Learning Tier"
                  placeholder={"Core"}
                  listItems={learningTierSelectItems}
                  onChange={handleLearningTierSelectChange}
                  $mr={[0, 24]}
                />
              </GridArea>
            </Grid>
            <OakLink page={"blog-single"} blogSlug="tbd-link-to-relevant-post">
              View Algebra thread
              <Icon name="chevron-right" $top={[6]} />
            </OakLink>
          </Box>
          <Box $ph={[16, 0]} $pb={[24, 48]}>
            {[1, 2, 3, 4, 5].map((unit: number) => (
              <Box key={unit}>
                <Card
                  $background="oakGrey1"
                  $pa={[24]}
                  $height={[150]}
                  $mr={[0, 16]}
                  $mv={[10]}
                >
                  <Heading tag={"h3"} $font={"heading-light-7"} $mb={16}>
                    {unit}.Unit name
                  </Heading>
                  <P>Thread</P>
                  <P>68 Lessons</P>
                </Card>
              </Box>
            ))}
          </Box>
        </MaxWidth>
      </Flex>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<
  ProgrammeHomePageProps
> = async () => {
  const data = await curriculumApi.programmeListingPaths();
  const results: GetStaticPropsResult<ProgrammeHomePageProps> = {
    props: {
      data: data,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default ProgrammeHomePage;
