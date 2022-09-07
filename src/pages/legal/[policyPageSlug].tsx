import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PortableText, PortableTextComponents } from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Typography, { Heading, P } from "../../components/Typography";
import CMSClient, { PolicyPage } from "../../node-lib/cms";
import { BasePortableTextProvider } from "../../components/PortableText";

type SerializedPolicyPage = Omit<PolicyPage, "lastUpdatedAt"> & {
  lastUpdatedAt: string;
};

export type PolicyPageProps = {
  policy: SerializedPolicyPage;
  isPreviewMode: boolean;
};

const customPolicyComponent: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <Heading $mb={[32, 48]} $mt={[64, 80]} tag={"h2"} $fontSize={[24, 32]}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading $mb={[24, 32]} $mt={[32, 64]} tag={"h3"} $fontSize={[20, 24]}>
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading $mb={[24, 32]} $mt={[32, 48]} tag={"h4"} $fontSize={[16, 20]}>
        {children}
      </Heading>
    ),
    normal: ({ children }) => (
      <P $fontSize={[16, 18]} $mb={[24]}>
        {children}
      </P>
    ),
  },
};

const Policies: NextPage<PolicyPageProps> = ({ policy, isPreviewMode }) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"white"}
      isPreviewMode={isPreviewMode}
    >
      <MaxWidth $ph={[36, 12]} $maxWidth={[720]}>
        <Grid>
          <GridArea $colSpan={[12, 12, 12]}>
            {/* change flex justify center to textAlign when PR fix is in */}
            <Flex $alignItems={"center"}>
              <Heading $mt={80} $mb={32} $fontSize={40} tag={"h1"}>
                {policy.title}
              </Heading>
            </Flex>
            <P $mb={16} $fontSize={14}>
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

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const policyResults = await CMSClient.policyPages();

  const paths = policyResults.map((policyPage) => ({
    params: { policyPageSlug: policyPage.slug },
  }));

  return {
    fallback: false,
    paths,
  };
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

  return {
    props: {
      policy,
      isPreviewMode,
    },
    revalidate: 10,
  };
};

export default Policies;
