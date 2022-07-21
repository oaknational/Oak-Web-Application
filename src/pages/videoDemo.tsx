import { FC } from "react";

import LandingPageLayout from "../components/Layout/LandingPageLayout";
import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import VideoPlayer from "../components/VideoPlayer";

const VideoDemo: FC = () => {
  return (
    <LandingPageLayout seoProps={DEFAULT_SEO_PROPS} background={"grey1"}>
      <Grid cg={16} rg={[16, 48, 80]} mt={[24]}>
        <GridArea colSpan={[12]}>
          <VideoPlayer playbackId="vsDMuuMEgg6wT6kJmqRZwODysVxnDtBh01jMThZm9ApU" />
        </GridArea>
      </Grid>
    </LandingPageLayout>
  );
};

export default VideoDemo;
