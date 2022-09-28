import { FC } from "react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Grid from "../../components/Grid";
import GridArea from "../../components/Grid/GridArea";
import AppLayout from "../../components/AppLayout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { Heading } from "../../components/Typography";

const PupilHomePage: FC = () => {
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <MaxWidth>
        <Grid $cg={16} $rg={[16, 48, 80]}>
          <GridArea $colSpan={[12, 12, 8]}>
            <Heading
              $font="heading-1"
              tag={"h1"}
              $mt={64}
              data-testid="home-page-title"
            >
              Pupil Home
            </Heading>
          </GridArea>
        </Grid>
      </MaxWidth>
    </AppLayout>
  );
};

export default PupilHomePage;
