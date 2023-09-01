import { NextPage } from "next";

import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/AppLayout/AppLayout";
import EarlyReleaseUnitsHeader from "@/components/EarlyReleaseUnitsHeader";

const EarlyReleaseUnits: NextPage = () => {
  return (
    <AppLayout seoProps={BETA_SEO_PROPS}>
      <EarlyReleaseUnitsHeader />
    </AppLayout>
  );
};

export default EarlyReleaseUnits;
