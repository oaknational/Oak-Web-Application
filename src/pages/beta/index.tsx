import { FC } from "react";

import AppLayout from "../../components/AppLayout";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Grid from "../../components/Grid";
import GridArea from "../../components/Grid/GridArea";
import { Heading } from "../../components/Typography";

const Beta: FC = () => {
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <Grid $cg={16} $rg={[16, 48, 80]}>
        <GridArea $colSpan={[12, 12, 8]}>
          <Heading
            $fontSize={48}
            tag={"h1"}
            $mt={64}
            data-testid="home-page-title"
          >
            Oak National Academy BETA
          </Heading>
        </GridArea>
      </Grid>
    </AppLayout>
  );
};

export default Beta;
