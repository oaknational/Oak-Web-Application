import { FC } from "react";

import Box from "../../Box";

import Flex from "@/components/Flex/Flex";
import { Heading } from "@/components/Typography";
import Typography from "@/components/Typography/Typography";
import SearchForm from "@/components/SearchForm/SearchForm";
import useSearch from "@/context/Search/useSearch";
import Illustration from "@/components/Illustration/Illustration";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
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
    <Flex $background={"mint"} $pv={24}>
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
              <Heading $font={"heading-7"} tag={"h1"}>
                Teachers
              </Heading>
              <Heading $font={"heading-3"} tag={"h2"}>
                Time-saving teaching resources
              </Heading>
              <Typography $font={"body-1"}>
                Get a head-start on your lesson planning using quality-checked
                resources you can download and adapt for free.
              </Typography>
              <Box $mt={16} $width={"90%"}>
                <SearchForm
                  placeholder="Search by keyword or topic"
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
            <Flex
              $pv={64}
              $flexDirection={"column"}
              $justifyContent={"space-between"}
              $alignItems={"flex-end"}
              $flex={"0 1 auto"}
              $position={"relative"}
              $minWidth={[0, 350]}
              $display={["none", "flex"]}
              $maxWidth={524}
            >
              <Illustration
                slug={"hero-pupils"}
                noCrop
                $objectFit="contain"
                priority
                $ba={3}
                $borderStyle={"solid"}
                $borderColor={"black"}
              />
              <ResourceSelectorCard
                icon={"worksheet"}
                title="Worksheets"
                angle={-4}
                $bottom={46}
                $left={130}
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
                icon={"quiz"}
                title="Quizzes"
                angle={4}
                $bottom={58}
                $left={340}
                $display={["none", "none", "flex"]}
              />
            </Flex>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default TeachersTab;
