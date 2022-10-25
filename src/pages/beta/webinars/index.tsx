import { NextPage } from "next";

import Layout from "../../../components/Layout";
import MaxWidth from "../../../components/MaxWidth/MaxWidth";
import { Heading } from "../../../components/Typography";

const WebinarsPage: NextPage = () => {
  return (
    <Layout
      seoProps={{ title: "Webinars", description: "A listing of webinars" }}
      $background={"white"}
    >
      <MaxWidth $pt={[64, 80]} $alignItems={"left"}>
        <Heading tag="h1">Webinar listing page stub</Heading>
      </MaxWidth>
    </Layout>
  );
};

export default WebinarsPage;
