import { FC } from "react";

import { DEFAULT_SEO_PROPS } from "../../../../browser-lib/seo/Seo";
import AppLayout from "../../../../components/AppLayout";
import Grid, { GridArea } from "../../../../components/Grid";
import { Heading } from "../../../../components/Typography";

const Beta: FC = () => {
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <Grid $cg={16} $rg={[16, 48, 80]}>
        <GridArea $colSpan={[12, 12, 8]}>
          <Heading
            $font={"heading-1"}
            tag={"h1"}
            $mt={64}
            data-testid="home-page-title"
          >
            Tiers page
          </Heading>
        </GridArea>
      </Grid>
    </AppLayout>
  );
};

export default Beta;
