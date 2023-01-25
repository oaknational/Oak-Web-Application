import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { PortableText, PortableTextComponents } from "@portabletext/react";

import CMSClient from "../../node-lib/cms";
import { PolicyPage } from "../../common-lib/cms-types";
import {
  decorateWithIsr,
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "../../node-lib/isr";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Typography, { Heading, P } from "../../components/Typography";
import { BasePortableTextProvider } from "../../components/PortableText";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";

type SerializedPolicyPage = Omit<PolicyPage, "lastUpdatedAt"> & {
  lastUpdatedAt: string;
};

export type PolicyPageProps = {
  policy: SerializedPolicyPage;
};

const customPolicyComponent: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <Heading
        $mb={[32, 48]}
        $mt={[64, 80]}
        tag={"h2"}
        $font={["heading-5", "heading-4"]}
      >
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading
        $mb={[24, 32]}
        $mt={[32, 64]}
        tag={"h3"}
        $font={["heading-6", "heading-5"]}
      >
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading
        $mb={[24, 32]}
        $mt={[32, 48]}
        tag={"h4"}
        $font={["heading-7", "heading-6"]}
      >
        {children}
      </Heading>
    ),
    normal: ({ children }) => (
      <P $font={["body-2", "body-1"]} $mb={[24]}>
        {children}
      </P>
    ),
  },
};

const Policies: NextPage<PolicyPageProps> = ({ policy }) => {
  return (
    <Layout
      seoProps={getSeoProps({
        ...policy.seo,
        title: policy.seo?.title || policy.title,
      })}
      $background={"white"}
    >
      <MaxWidth $ph={[16, 24]} $maxWidth={[720]}>
        <Grid>
          <GridArea $colSpan={[12, 12, 12]}>
            {/* change flex justify center to textAlign when PR fix is in */}
            <Flex $alignItems={"center"}>
              <Heading $mt={80} $mb={32} $font={"heading-3"} tag={"h1"}>
                {policy.title}
              </Heading>
            </Flex>
            <P $mb={16} $font={"body-3"}>
              Updated{" "}
              <time dateTime={policy.lastUpdatedAt}>
                {new Date(policy.lastUpdatedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </P>
            <Typography>
              <BasePortableTextProvider>
                <PortableText
                  value={policy.bodyPortableText}
                  components={customPolicyComponent}
                />
              </BasePortableTextProvider>
            </Typography>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Layout>
  );
};

type URLParams = {
  policyPageSlug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const policyResults = await CMSClient.policyPages();

  const paths = policyResults.map((policyPage) => ({
    params: { policyPageSlug: policyPage.slug },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: false,
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  PolicyPageProps,
  URLParams
> = async (context) => {
  const isPreviewMode = context.preview === true;

  const policyPageSlug = context?.params?.policyPageSlug as string;
  const policyResult = await CMSClient.policyPageBySlug(policyPageSlug, {
    previewMode: isPreviewMode,
  });

  if (!policyResult) {
    return {
      notFound: true,
    };
  }

  const policy = {
    ...policyResult,
    lastUpdatedAt: policyResult.lastUpdatedAt.toISOString(),
  };

  const results: GetStaticPropsResult<PolicyPageProps> = {
    props: {
      policy,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default Policies;
