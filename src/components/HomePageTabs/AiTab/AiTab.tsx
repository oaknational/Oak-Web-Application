import { FC } from "react";

import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Flex from "@/components/Flex";
import { GridArea } from "@/components/Grid";
import Grid from "@/components/Grid/Grid";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
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
              <Heading $font={"heading-7"} tag={"h1"} $color={"oakGrey5"}>
                Teachers
              </Heading>
              <Heading $font={"heading-3"} tag={"h2"}>
                AI tools created for educators
              </Heading>
              <Typography $font={"body-1"}>
                Plan lessons and create quizzes with Oak AI Experiments, a new
                and freely available suite of practical AI tools designed to
                help save teachers time.
              </Typography>
              <ButtonAsLink
                label={"Go to Oak AI Experiments"}
                aria-label="Try our ai tools (this will open in a new tab)"
                variant={"brushNav"}
                page={"labs"}
                icon={"external"}
                $iconPosition={"trailing"}
                iconBackground="black"
                $mb={24}
              />
            </Flex>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Flex>
  );
};

export default AiTab;
