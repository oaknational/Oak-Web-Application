import { FC } from "react";

import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Flex from "@/components/Flex";
import { GridArea } from "@/components/Grid";
import Grid from "@/components/Grid/Grid";
import Illustration from "@/components/Illustration/Illustration";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
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
              <Heading $font={"heading-7"} tag={"h1"} $color={"oakGrey5"}>
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
                slug={"pupils-with-worksheet"}
                noCrop
                $objectFit="contain"
                priority
                $ba={3}
                $borderStyle={"solid"}
                $borderColor={"black"}
              />
              <Svg
                $position={"absolute"}
                $top={0}
                $left={-20}
                $display={["none", "none", "block"]}
                name="burst"
                $transform={"scale(1.5)"}
              />
            </Flex>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default PupilTab;
