import { FC } from "react";

import ImageContainer from "../ImageContainer/ImageContainer";

import Box from "@/components/SharedComponents/Box/Box";
import Flex from "@/components/SharedComponents/Flex";
import { Heading } from "@/components/Typography";
import Typography from "@/components/Typography/Typography";
import SearchForm from "@/components/SearchForm/SearchForm";
import useSearch from "@/context/Search/useSearch";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import ResourceSelectorCard from "@/components/ResourceSelectorCard/ResourceSelectorCard";
import { KeyStageKeypadProps } from "@/components/KeyStageKeypad/KeyStageKeypad";
import Grid from "@/components/Grid/Grid";
import { GridArea } from "@/components/Grid";
import KeyStageKeypad from "@/components/KeyStageKeypad";

type TeacherTabProps = {
  keyStages: KeyStageKeypadProps["keyStages"];
};
const TeachersTab: FC<TeacherTabProps> = ({ keyStages }) => {
  const { setSearchTerm } = useSearch({});
  return (
    <Flex $background={"mint"} $pv={24} $overflow={"hidden"}>
      <MaxWidth $ph={[16]}>
        <Grid $cg={16}>
          <GridArea $colSpan={[12, 6]}>
            <Flex
              $flexDirection={"column"}
              $maxWidth={[640]}
              $pt={32}
              $alignItems={"flex-start"}
              $gap={24}
              $flex={"0 1 auto"}
            >
              <Heading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
                Teachers
              </Heading>
              <Heading $font={"heading-3"} tag={"h2"}>
                Time-saving teaching resources
              </Heading>
              <Typography $font={"body-1"}>
                Get a head-start on your lesson planning using quality-checked
                resources you can download and adapt for free.
              </Typography>
              <Box $mt={16} $width={["100%", "100%", "90%"]}>
                <SearchForm
                  placeholderText="Search by keyword or topic"
                  searchTerm=""
                  handleSubmit={(value) => {
                    setSearchTerm(value);
                  }}
                  analyticsSearchSource={"homepage search box"}
                />
              </Box>
              <Box $pv={32} $width={"100%"}>
                <KeyStageKeypad keyStages={keyStages} />
              </Box>
            </Flex>
          </GridArea>
          <GridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
            <ImageContainer imageSlug={"hero-pupils"}>
              <ResourceSelectorCard
                icon={"worksheet"}
                title="Worksheets"
                angle={-4}
                $bottom={30}
                $left={166}
                $display={["none", "none", "flex"]}
              />
              <ResourceSelectorCard
                icon={"slide-deck"}
                title="Slide decks"
                angle={2}
                $bottom={110}
                $left={-72}
                $display={["none", "none", "flex"]}
              />
              <ResourceSelectorCard
                icon={"quiz-white"}
                title="Quizzes"
                angle={4}
                $bottom={60}
                $right={-54}
                $display={["none", "none", "flex"]}
              />
            </ImageContainer>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default TeachersTab;
