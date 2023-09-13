import { useEffect, useState } from "react";
import { GetStaticProps, NextPage } from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import AppLayout from "@/components/AppLayout";
import MaxWidth from "@/components/MaxWidth/MaxWidth";
import { Heading, P } from "@/components/Typography";
import getPageProps from "@/node-lib/getPageProps";

type ErrorTestPageProps = {
  generatedAt: string;
};
const ErrorTestPage: NextPage<ErrorTestPageProps> = (props) => {
  const [timeNow, setClientNow] = useState<string>();
  useEffect(() => {
    setClientNow(new Date().toISOString());
  }, []);
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          title: `Error test page`,
        }),
        ...{ noFollow: true, noIndex: true },
      }}
      $background="white"
    >
      <MaxWidth $pv={120}>
        <Heading tag="h1">Error test page</Heading>
        <P>
          Note: getStaticProps will error if the minute value is an odd number{" "}
        </P>
        <P>Generated at: {props.generatedAt}</P>
        <P>Time now: {timeNow}</P>
      </MaxWidth>
    </AppLayout>
  );
};

export const getStaticProps: GetStaticProps<ErrorTestPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "error-test-page::getStaticProps",
    context,
    getProps: async () => {
      const now = new Date();
      if (now.getMinutes() % 2 === 1) {
        throw new Error("Test: odd minute value");
      }
      return {
        props: {
          generatedAt: now.toISOString(),
        },
      };
    },
  });
};

export default ErrorTestPage;
