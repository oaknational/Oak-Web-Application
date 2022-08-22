import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { PortableText } from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Typography, { Heading, P } from "../../components/Typography";
import CMSClient, { PolicyPage } from "../../node-lib/cms";

type SerializedPolicyPage = Omit<PolicyPage, "lastUpdatedAt"> & {
  lastUpdatedAt: string;
};

export type PolicyPageProps = {
  policy: SerializedPolicyPage;
  isPreviewMode: boolean;
};

const Policies: NextPage<PolicyPageProps> = ({ policy, isPreviewMode }) => {
  return (
    <Layout
      seoProps={DEFAULT_SEO_PROPS}
      $background={"grey1"}
      isPreviewMode={isPreviewMode}
    >
      <MaxWidth>
        <Grid>
          <GridArea $colSpan={[12, 12, 12]}>
            {/* change flex justify center to textAlign when PR fix is in */}
            <Flex $justifyContent={"center"}>
              <Heading $mv={80} $fontSize={48} tag={"h1"}>
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
              <PortableText value={policy.bodyPortableText} />
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

  const policy = {
    ...policyResult,
    lastUpdatedAt: policyResult.lastUpdatedAt.toISOString(),
  };

  return {
    props: {
      policy,
      isPreviewMode,
    },
  };
};

export default Policies;
