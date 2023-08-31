import { NextPage } from "next";

import { BETA_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/AppLayout/AppLayout";
import ExemplarUnitsHeader from "@/components/ExemplarUnitsHeader/";

const ExemplarUnits: NextPage = () => {
  return (
    <AppLayout seoProps={BETA_SEO_PROPS}>
      <ExemplarUnitsHeader />
    </AppLayout>
  );
};

export default ExemplarUnits;
