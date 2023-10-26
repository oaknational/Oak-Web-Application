import { FC } from "react";

import ImageContainer from "../ImageContainer/ImageContainer";

import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Flex from "@/components/Flex";
import { GridArea } from "@/components/Grid";
import Grid from "@/components/Grid/Grid";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import Svg from "@/components/Svg/Svg";
import { Heading } from "@/components/Typography";
import Typography from "@/components/Typography/Typography";

const AiTab: FC = () => {
  return (
    <Flex $background={"pupilsPink"} $pv={24} $overflow={"hidden"}>
      <MaxWidth $ph={[16]} $pb={24}>
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
              <Heading $font={"heading-3"} tag={"h2"}>
                AI Tools created for educators
              </Heading>

              <Typography $font={"body-1"}>
                Oak AI Experiments offers a suite of practical AI tools designed
                for and freely available to teachers. We are actively looking
                for your feedback to refine and optimise these tools, making
                them more effective and time-saving.
              </Typography>

              <ButtonAsLink
                label={"Go to labs"}
                aria-label="Try our ai tools (this will open in a new tab)"
                variant={"brushNav"}
                page={"labs"}
                icon={"arrow-right"}
                $iconPosition={"trailing"}
                iconBackground="black"
                $mb={24}
              />
            </Flex>
          </GridArea>
          <GridArea $colSpan={[12, 6]} $alignItems={"flex-end"}>
            <ImageContainer imageSlug={"pupils-with-worksheet"}>
              <Svg
                $position={"absolute"}
                $top={0}
                $left={-20}
                $display={["none", "none", "block"]}
                name="burst"
                $transform={"scale(1.5)"}
              />
            </ImageContainer>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default AiTab;
