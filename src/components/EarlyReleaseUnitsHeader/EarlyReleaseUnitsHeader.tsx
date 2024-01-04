import { GridArea } from "../Grid";
import Grid from "../Grid/Grid";
import Illustration from "../Illustration/Illustration";
import { Heading } from "../Typography";
import Typography from "../Typography/Typography";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";

const EarlyReleaseUnitsHeader = () => {
  return (
    <Box $background={"aqua"} $pv={24}>
      <MaxWidth $pv={24}>
        <Grid $ph={[16, 0]}>
          <GridArea $colSpan={[12, 12, 6]} $pt={36} $gap={24}>
            <Heading tag={"h1"} $font={"heading-7"}>
              Teachers & subject leads
            </Heading>
            <Heading tag="h2" $font={"heading-3"}>
              New teaching resources
            </Heading>
            <Typography>
              We're releasing new teaching resources throughout this academic
              year, with everything available to you by summer 2024.
            </Typography>
            <Typography>Explore our early-release units...</Typography>
            <Flex $gap={30} $flexDirection={["column", "row"]}>
              <ButtonAsLink
                variant={"brushNav"}
                page={null}
                icon="arrow-down"
                iconBackground={"black"}
                $iconPosition="trailing"
                label={"View primary resources"}
                href={"#primary"}
              />
              <ButtonAsLink
                variant={"brushNav"}
                page={null}
                icon="arrow-down"
                iconBackground={"black"}
                $iconPosition="trailing"
                label={"View secondary resources"}
                href={"#secondary"}
              />
            </Flex>
          </GridArea>
          <GridArea $colSpan={[0, 0, 6]}>
            <Box $ph={96}>
              <Illustration
                noCrop
                $display={["none", "none", "block"]}
                slug={"teacher-carrying-stuff"}
                $objectFit="contain"
                $position={"relative"}
                $maxHeight={420}
                height={420}
                width={420}
              />
            </Box>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Box>
  );
};

export default EarlyReleaseUnitsHeader;
