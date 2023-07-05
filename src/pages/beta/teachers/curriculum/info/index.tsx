import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import { FC } from "react";

import { subjects, schoolPhase, mathsCurriculaDesc } from "./data";

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
import Card from "components/Card/Card";
import DropdownSelect from "components/DropdownSelect";
import ButtonAsLink from "components/Button/ButtonAsLink";
import SubjectIcon from "components/SubjectIcon/SubjectIcon";
import BrushBorders from "components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import CardTitle from "components/Card/CardComponents/CardTitle";
import AvatarImage from "components/AvatarImage/AvatarImage";

export type CurriculumInfoPageProps = {
  data: ProgrammeListingPaths;
};

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = () => {
  // const { data } = props;
  // console.log(data);

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

      <Box $background={"white"} $ma={"auto"}>
        <Box $background={"grey1"}>
          <Flex>
            <Button label="Curriculum info" $ml={6} background={"white"} />
            <Button label="Unit sequence" $ml={16} />
          </Flex>
        </Box>
        <Flex $maxWidth={"100%"} $pv={10} $ph={20} $justifyContent={"center"}>
          <Box $ph={30} $pv={20}>
            <P>{mathsCurriculaDesc}</P>
          </Box>
          <SubjectIcon subjectSlug="maths" width={100} $ph={72} $ma={"auto"} />
        </Flex>
      </Box>
      <Box $background={"white"}>
        <Flex $justifyContent={"center"}>
          {[1, 2, 3].map((pointNum) => {
            return (
              <Card
                $mh={20}
                $mv={20}
                $background={"teachersLilac"}
                key={`example-curricula-points-${pointNum}`}
              >
                <BrushBorders color={"teachersLilac"} />
                <CardTitle tag={"h4"}>Point {pointNum}</CardTitle>
                <P>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
                  massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                  sapien fringilla, mattis ligula consectetur, ultrices mauris.
                  Maecenas vitae mattis tellus.
                </P>
              </Card>
            );
          })}
        </Flex>
      </Box>
      <Box $background={"white"} $ph={50} $pt={36} $pb={36} $ma={"auto"}>
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
      </Box>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<
  CurriculumInfoPageProps
> = async () => {
  const data = await curriculumApi.programmeListingPaths();
  const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
    props: {
      data: data,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

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
