import { NextPage } from "next";

import Layout from "../../../components/Layout";
import MaxWidth from "../../../components/MaxWidth/MaxWidth";

const WebinarsPage: NextPage = () => {
  return (
    <Layout
      seoProps={{ title: "Webinars", description: "A listing of webinars" }}
      $background={"white"}
    >
      <MaxWidth $pt={[64, 80]} $alignItems={"center"}>
        Webinar page
      </MaxWidth>
    </Layout>
  );
};

export default WebinarsPage;
