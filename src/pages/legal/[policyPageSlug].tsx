import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { PortableTextComponents } from "@portabletext/react";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakMaxWidth,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";

import CMSClient from "@/node-lib/cms";
import { PolicyPage } from "@/common-lib/cms-types";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import Layout from "@/components/AppComponents/Layout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import OwaLink from "@/components/SharedComponents/OwaLink";

type SerializedPolicyPage = Omit<PolicyPage, "lastUpdatedAt"> & {
  lastUpdatedAt: string;
};

export type PolicyPageProps = {
  policy: SerializedPolicyPage;
};

const customPolicyComponent: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <OakHeading
        $mb={["space-between-m2", "space-between-l"]}
        $mt={["space-between-xl", "space-between-xxxl"]}
        tag={"h2"}
        $font={["heading-5", "heading-4"]}
      >
        {children}
      </OakHeading>
    ),
    h3: ({ children }) => (
      <OakHeading
        $mb={["space-between-m", "space-between-m2"]}
        $mt={["space-between-m2", "space-between-xl"]}
        tag={"h3"}
        $font={["heading-6", "heading-5"]}
      >
        {children}
      </OakHeading>
    ),
    h4: ({ children }) => (
      <OakHeading
        $mb={["space-between-m", "space-between-m2"]}
        $mt={["space-between-m2", "space-between-l"]}
        tag={"h4"}
        $font={["heading-7", "heading-6"]}
      >
        {children}
      </OakHeading>
    ),
    normal: ({ children }) => (
      <OakP $font={["body-2", "body-1"]} $mb={["space-between-m"]}>
        {children}
      </OakP>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      let ariaLabel = "";
      if (Array.isArray(children)) {
        ariaLabel = children[0];
      }
      return (
        <OwaLink
          href={value?.href}
          aria-label={ariaLabel}
          $textDecoration={"underline"}
          page={null}
        >
          {children}
        </OwaLink>
      );
    },
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
      <OakMaxWidth
        $ph={["inner-padding-m", "inner-padding-xl"]}
        $maxWidth={["all-spacing-22"]}
      >
        <OakGrid>
          <OakGridArea $colSpan={[12, 12, 12]}>
            <OakHeading
              $mt={"space-between-xxxl"}
              $mb={"space-between-m2"}
              $font={"heading-3"}
              tag={"h1"}
            >
              {policy.title}
            </OakHeading>
            <OakP $mb={"space-between-s"} $font={"body-3"}>
              Updated{" "}
              <time dateTime={policy.lastUpdatedAt}>
                {new Date(policy.lastUpdatedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </OakP>
            <OakTypography>
              <PortableTextWithDefaults
                value={policy.bodyPortableText}
                components={customPolicyComponent}
                withoutDefaultComponents
              />
            </OakTypography>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
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
  return getPageProps({
    page: "legal-page::getStaticProps",
    context,
    getProps: async () => {
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
      return results;
    },
  });
};

export default Policies;
