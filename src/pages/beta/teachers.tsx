import { FC } from "react";

import AppLayout from "../../components/AppLayout";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Grid from "../../components/Grid";
import GridArea from "../../components/Grid/GridArea";
import { Heading } from "../../components/Typography";

const Teachers: FC = () => {
  return (
    <AppLayout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
      <Grid $cg={16} $rg={[16, 48, 80]}>
        <GridArea $colSpan={[12, 12, 8]}>
          <Heading $font={"heading-1"} tag={"h1"} $mt={64}>
            Teachers homepage
          </Heading>
        </GridArea>
      </Grid>
    </AppLayout>
  );
};

export default Teachers;
