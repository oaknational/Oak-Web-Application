import { FC } from "react";

import ImageContainer from "../ImageContainer/ImageContainer";

import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";
import { GridArea } from "@/components/Grid";
import Grid from "@/components/Grid/Grid";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Svg from "@/components/Svg/Svg";
import { Heading } from "@/components/Typography";
import Typography from "@/components/Typography/Typography";

const PupilTab: FC = () => {
  return (
    <Flex $background={"lemon"} $pv={24} $overflow={"hidden"}>
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
              <Heading $font={"heading-7"} tag={"h1"} $color={"grey70"}>
                Pupils
              </Heading>
              <Heading $font={"heading-3"} tag={"h2"}>
                Learn online
              </Heading>

              <Typography $font={"body-1"}>
                Use our online lessons and quizzes to learn and revise.
              </Typography>

              <ButtonAsLink
                label={"Learn with Oak"}
                aria-label="Learn with Oak (this will open in a new tab)"
                variant={"brushNav"}
                page={"classroom"}
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

export default PupilTab;
