import { GetStaticPaths, GetStaticProps } from "next";
import { FC } from "react";

import policyPageBody from "../../browser-lib/fixtures/policyPageBody";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";
import Flex from "../../components/Flex";
import Grid, { GridArea } from "../../components/Grid";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import Typography, { Heading, P } from "../../components/Typography";

type PolicyPageProps = {
  policy: {
    title: string;
    updatedAt: string; // change back to data with sanity data
    body: string;
  };
};

const Policies: FC<PolicyPageProps> = ({ policy }) => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} $background={"grey1"}>
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
              {`Updated ${policy.updatedAt}`}
            </P>
            <Typography>
              <div dangerouslySetInnerHTML={{ __html: policy.body }} />
            </Typography>
          </GridArea>
        </Grid>
      </MaxWidth>
    </Layout>
  );
};

export default Policies;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = [
    {
      params: { policyPageSlug: "privacy-policy" },
    },
  ];

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<PolicyPageProps> = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context
) => {
  return {
    props: {
      policy: {
        // Forgot if next will serialize the date or if you'll need to pass it as a string
        title: "Privacy Policy",
        updatedAt: String(new Date().getFullYear()),
        body: policyPageBody,
      },
    },
  };
};
