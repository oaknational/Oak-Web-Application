import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import React, { FC } from "react";

import AppLayout from "@/components/AppLayout/AppLayout";
import Box from "@/components/Box/Box";
import Flex from "@/components/Flex/Flex";
import P, { Heading, Hr, UL, LI } from "@/components/Typography";
import Card from "@/components/Card/Card";
import SubjectIcon from "@/components/SubjectIcon/SubjectIcon";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";
import AvatarImage from "@/components/AvatarImage/AvatarImage";
import OakLink from "@/components/OakLink/OakLink";
import Icon from "@/components/Icon/Icon";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import TabularNav from "@/components/TabularNav/TabularNav";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Typography from "@/components/Typography/Typography";
import curriculumApi, {
  curriculumSubjectPhaseOverviewData,
} from "@/node-lib/curriculum-api-2023";
import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import SubjectPhasePicker, {
  SubjectPhasePickerData,
} from "@/components/SubjectPhasePicker/SubjectPhasePicker";
import { fetchSubjectPhasePickerData } from "@/pages/beta/[viewType]/curriculum/index";
import getPageProps from "@/node-lib/getPageProps";
import { ViewType } from "@/common-lib/urls";
import DropdownSelect from "@/components/DropdownSelect/DropdownSelect";

export type CurriculumInfoPageProps = {
  data: curriculumSubjectPhaseOverviewData;
  subjectPhaseOptions: SubjectPhasePickerData;
  tab: string | string[];
};

const CurriculumInfoPage: NextPage<CurriculumInfoPageProps> = ({
  data,
  subjectPhaseOptions,
  tab,
}) => {
  const renderTab = () => {
    if (tab === "overview") {
      return <OverviewTab {...data} />;
    }
    if (tab === "sequence") {
      return (
        <SequenceTab
          {...{
            threads: [
              "Algebra",
              "Geometry and Measure",
              "Number",
              "Probability",
              "Ratio and Proportion",
              "Statistics",
            ],
            units: [
              "Counting, recognising and comparing numbers 0-10",
              "Counting to and from 20",
              "Counting in tens - decade numbers",
              "Pattern in counting from 20 to 100",
              "Comparing quantities - part whole relationships",
              "Composition of numbers 0 to 5",
              "Recognise, compose, decompose and manipulate 3D shapes",
              " Composition of numbers 6 to 10",
            ],
          }}
        />
      );
    }
  };
  return (
    <AppLayout
      seoProps={BETA_SEO_PROPS}
      $background={"white"}
      headerVariant="landing-pages"
    >
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
          <SubjectPhasePicker {...subjectPhaseOptions} />
        </Box>
      </Flex>
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

              <Heading tag={"h1"} $font={"heading-light-3"} $mr={26}>
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
              href: `/beta/teachers/curriculum/info/overview`, //`/beta/teachers/curriculum/info/${subjectPhase}/overview`,
              label: "Overview",
              page: null,
            },
            {
              href: "/beta/teachers/curriculum/info/sequence",
              label: "Unit sequence",
              page: null,
            },
            {
              href: "/beta/teachers/curriculum/info/download",
              label: "Downloads",
              page: null,
            },
          ]}
        />
      </Box>

      <Box $background={"white"}>{renderTab()}</Box>
    </AppLayout>
  );
};

export type URLParams = {
  viewType: ViewType;
  subjectPhaseSlug: string;
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

export const getStaticProps: GetStaticProps<CurriculumInfoPageProps> = async (
  context
) => {
  return getPageProps({
    page: "curriculum-info::getStaticProps",
    context,
    getProps: async () => {
      if (!context.params) {
        throw new Error("Missing params");
      }

      // Parse and use params instead of "maths" and "secondary" when MV is ready
      const overviewData =
        await curriculumApi.curriculumSubjectPhaseOverviewPage({
          subject: "maths",
          phase: "secondary",
        });
      const subjectPhaseData = await fetchSubjectPhasePickerData();
      console.log(context.params?.tab);
      const results: GetStaticPropsResult<CurriculumInfoPageProps> = {
        props: {
          data: overviewData,
          subjectPhaseOptions: subjectPhaseData,
          tab: context.params.tab ? context.params.tab : "overview",
        },
      };
      const resultsWithIsr = decorateWithIsr(results);
      return resultsWithIsr;
    },
  });
};

export default CurriculumInfoPage;

type OverviewTabProps = {
  subjectPrinciples: string[];
  curriculaDesc: string;
  partnerBio: string;
  videoGuideDesc: string;
};

const OverviewTab: FC<OverviewTabProps> = (props: OverviewTabProps) => {
  const { subjectPrinciples, curriculaDesc, partnerBio, videoGuideDesc } =
    props;
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
            subjectSlug="maths"
            $maxHeight={200}
            $maxWidth={200}
            $transform={["rotate(-2.179deg)", "scale(1.25, 1.25)"]}
            $background={"lemon50"}
          />
        </Card>
      </Flex>

      <Card
        $maxWidth={"100%"}
        // $ma={"auto"}
        $background={"aqua30"}
        $zIndex={"neutral"}
      >
        <BrushBorders color={"aqua30"} />
        <Box $ma={16}>
          <Heading tag="h2" $font={["heading-5", "heading-6"]}>
            Subject principles
          </Heading>
          <UL $reset={true} $mt={24}>
            {subjectPrinciples.map((item, i) => (
              <LI $mb={[12]} key={`principle-${i + 1}`}>
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
              page="search"
              viewType="teachers"
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

type SequenceTabProps = {
  units: string[];
  threads: string[];
};

const SequenceTab: FC<SequenceTabProps> = (props: SequenceTabProps) => {
  const { units, threads } = props;
  return (
    <Box $maxWidth={"80%"} $ma={"auto"} $pb={80}>
      <Flex $justifyContent={"space-between"}>
        <Box $minWidth={"20%"} $maxWidth={"20%"} $mr={10}>
          <DropdownSelect
            $mv={10}
            name="year-group-selection"
            id={`year-group-seleciton`}
            $mt={32}
            label="Year group"
            placeholder="All"
            listItems={[
              { label: "All", value: "all" },
              { label: "Year 7", value: "year7" },
            ]}
            onChange={() => {
              return [];
            }}
          />

          <Box>
            <Box>
              <Heading tag={"h3"} $font={"heading-7"} $mv={12}>
                Threads
              </Heading>
              <P $mv={6}>Select to highlight in the curriculum sequence</P>
              <Flex $flexDirection={"column"}>
                {threads.map((thread, i) => (
                  <Card
                    key={i + "thread"}
                    $background={"aqua50"}
                    $mv={4}
                    $pa={10}
                    $borderRadius={6}
                  >
                    {thread}
                  </Card>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>

        <Box>
          <Heading tag="h4" $font={"heading-6"} $mv={20}>
            Year 10
          </Heading>{" "}
          <Flex $maxWidth={"85%"} $flexWrap={"wrap"}>
            {units.map((unit, i) => {
              return (
                <Card
                  key={i + "unit"}
                  $background={"aqua30"}
                  $mv={8}
                  $ml={12}
                  $maxWidth={"30%"}
                  $borderRadius={8}
                >
                  <Heading tag={"h3"} $font={"heading-7"}>
                    {unit}
                  </Heading>
                  <P $textAlign={"right"}>Unit info</P>
                </Card>
              );
            })}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
