import { FC } from "react";

import { Heading, P, Span } from "@/components/Typography";
import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Grid, { GridArea } from "@/components/Grid";
import KeyStageKeypad from "@/components/KeyStageKeypad";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import OakLink from "@/components/OakLink";
import SearchForm from "@/components/SearchForm";
import UnderlinedHeading from "@/components/Typography/UnderlinedHeading";
import useSearch from "@/context/Search/useSearch";
import { TeachersHomePageData } from "@/node-lib/curriculum-api";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";

type OldBetaHomeTabProps = {
  curriculumData: TeachersHomePageData;
};
const OldBetaHomeTab: FC<OldBetaHomeTabProps> = (props) => {
  const { curriculumData } = props;
  const { setSearchTerm } = useSearch({});

  const { track } = useAnalytics();
  const { analyticsUseCase, pageName } = useAnalyticsPageProps();
  const trackSearchAttempted = (searchTerm: string) => {
    track.searchAttempted({
      searchTerm: searchTerm,
      analyticsUseCase: analyticsUseCase,
      pageName,
      searchFilterOptionSelected: [],
      searchSource: "homepage search suggestion",
    });
  };
  return (
    <Flex $justifyContent={"center"} $background={"pupilsLightGreen"}>
      <MaxWidth $mb={[48, 24]}>
        <Box $ph={[16, 0]}>
          <Heading
            $font={["heading-5", "heading-4"]}
            tag={"h1"}
            $mt={120}
            $color={"black"}
          >
            Your foundation for great lessons
          </Heading>
          <Heading $font={"heading-light-6"} tag={"h2"} $mt={8}>
            Find inspiration. Get support. Go teach.
          </Heading>
          <Grid $mt={48} $cg={16}>
            <GridArea $colSpan={[12, 6, 4]} $pr={16}>
              <UnderlinedHeading $font={"heading-6"} tag={"h2"} $mt={8}>
                Search our resources by topic
              </UnderlinedHeading>
              <P $mt={16} $font={"body-2"}>
                Discover thousands of free, adaptable teaching resources,
                including slides, worksheets and&nbsp;quizzes.
              </P>
              <Box $mt={16}>
                <SearchForm
                  placeholderText="Search by keyword or topic"
                  searchTerm=""
                  handleSubmit={(value) => {
                    setSearchTerm(value);
                  }}
                  analyticsSearchSource={"homepage search box"}
                />
              </Box>
              <P $mt={18} $font={"body-2"}>
                Search suggestions:
              </P>
              <Span>
                <OakLink
                  page={"search"}
                  viewType="teachers"
                  query={{ term: "algebra" }}
                  $color={"black"}
                  $font="heading-7"
                  onClick={() => trackSearchAttempted("algebra")}
                >
                  Algebra,&nbsp;
                </OakLink>
                <OakLink
                  page={"search"}
                  viewType="teachers"
                  query={{ term: "computing" }}
                  $color={"black"}
                  $font="heading-7"
                  onClick={() => trackSearchAttempted("computing")}
                >
                  Computing,&nbsp;
                </OakLink>

                <OakLink
                  page={"search"}
                  viewType="teachers"
                  query={{ term: "a midsummer nights dream" }}
                  $font="heading-7"
                  onClick={() =>
                    trackSearchAttempted("a midsummer nights dream")
                  }
                >
                  A Midsummer Night's Dream
                </OakLink>
              </Span>
            </GridArea>
            <GridArea $colSpan={[12, 6, 4]} $mt={[56, 0]}>
              <UnderlinedHeading $font={"heading-6"} tag={"h2"} $mt={8}>
                Start exploring subjects
              </UnderlinedHeading>
              <P $mt={16} $font={"body-2"}>
                Select a key stage to find teaching resources in your
                subject&nbsp;area.
              </P>
              <Box $mt={40}>
                <KeyStageKeypad keyStages={curriculumData.keyStages} />
              </Box>
            </GridArea>
          </Grid>
        </Box>
      </MaxWidth>
    </Flex>
  );
};

export default OldBetaHomeTab;
