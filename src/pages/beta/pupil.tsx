import { FC } from "react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Grid from "../../components/Grid";
import GridArea from "../../components/Grid/GridArea";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { Heading } from "../../components/Typography";

const PupilHome: FC = () => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      headerVariant="app"
      $background={"grey1"}
    >
      <MaxWidth>
        <Grid $cg={16} $rg={[16, 48, 80]}>
          <GridArea $colSpan={[12, 12, 8]}>
            <Heading
              $fontSize={48}
              tag={"h1"}
              $mt={64}
              data-testid="home-page-title"
            >
              Pupil Home
            </Heading>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Layout>
  );
};

export default PupilHome;
