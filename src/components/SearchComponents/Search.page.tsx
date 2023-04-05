import { FC } from "react";

import {
  KeyStage,
  UseKeyStageFiltersReturnType,
} from "../../context/Search/useKeyStageFilters";
import { UseSearchReturnType } from "../../context/Search/useSearch";
import Box from "../Box";
import Card from "../Card";
import Flex from "../Flex";
import Grid, { GridArea } from "../Grid";
import MaxWidth from "../MaxWidth/MaxWidth";
import MobileFilters from "../MobileFilters";
import SearchFilters from "../SearchFilters";
import ActiveFilters from "../SearchFilters/ActiveFilters";
import SearchForm from "../SearchForm";
import SearchResults from "../SearchResults";
import NoSearchResults from "../SearchResults/NoSearchResults";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { Heading } from "../Typography";

export type SearchProps = UseSearchReturnType & {
  keyStageFilters: UseKeyStageFiltersReturnType;
  allKeyStages: KeyStage[];
};
const Search: FC<SearchProps> = (props) => {
  const {
    query,
    setSearchTerm,
    status,
    results,
    allKeyStages,
    keyStageFilters,
  } = props;

  const shouldShowError = status === "fail";
  const shouldShowLoading = status === "loading";
  const shouldShowNoResultsMessage = status === "success" && !results.length;
  const shouldShowResults = status === "success" && results.length > 0;

  return (
    <Flex $background="white" $flexDirection={"column"}>
      <MaxWidth $ph={16}>
        <Grid $mt={48} $cg={16}>
          <GridArea $colSpan={[12, 12, 12]} $mt={24} $mb={24}>
            <Flex $flexDirection={["column"]}>
              {query.term ? (
                <Heading
                  tag={"h1"}
                  $font={["heading-5", "heading-4"]}
                  $mt={24}
                  $wordWrap={"break-word"}
                >
                  &ldquo;{query.term}&rdquo;
                </Heading>
              ) : (
                <Heading tag={"h1"} $font={["heading-5", "heading-4"]} $mt={24}>
                  Search
                </Heading>
              )}
              <Heading tag="h2" $font={"heading-light-6"} $mt={24}>
                Search for topics and key words to explore thousands of lessons
                with adaptable teaching resources
              </Heading>
              <Card
                $background={"teachersPastelYellow"}
                $width={"100%"}
                $pv={[24]}
                $ph={[16, 24]}
                $mt={24}
                $mb={20}
                $position={"relative"}
              >
                <SearchForm
                  searchTerm={query.term}
                  handleSubmit={setSearchTerm}
                />
                <BrushBorders color={"teachersPastelYellow"} />
              </Card>
            </Flex>
            <ActiveFilters keyStageFilters={keyStageFilters} />
          </GridArea>
          <GridArea $colSpan={[12, 3]} $pr={16}>
            <Flex $flexDirection="column" $mb={32} $display={["none", "flex"]}>
              <SearchFilters keyStageFilters={keyStageFilters} />
            </Flex>
            <Box $mb={32}>
              <MobileFilters
                label="Filters"
                labelOpened="Close"
                iconOpened="cross"
                iconClosed="hamburger"
              >
                <SearchFilters keyStageFilters={keyStageFilters} />
              </MobileFilters>
            </Box>
          </GridArea>
          <GridArea $colSpan={[12, 9]} $pr={16}>
            <div role="status">
              {shouldShowError && (
                <p>There was an error fetching search results</p>
              )}
              {shouldShowLoading && <p>Loading...</p>}
              {shouldShowNoResultsMessage && (
                <NoSearchResults searchTerm={query.term} />
              )}
            </div>
            {shouldShowResults && (
              <SearchResults hits={results} allKeyStages={allKeyStages} />
            )}
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default Search;
