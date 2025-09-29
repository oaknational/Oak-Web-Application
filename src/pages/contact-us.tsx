import React from "react";
import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import styled from "styled-components";
import {
  MissingComponentHandler,
  PortableTextComponents,
} from "@portabletext/react";

import {
  OakHeading,
  OakP,
  OakFlex,
  OakMaxWidth,
  OakBox,
} from "@oaknational/oak-components";
import CMSClient from "@/node-lib/cms";
import { ContactPage } from "@/common-lib/cms-types";
import Layout from "@/components/AppComponents/Layout";
import Card from "@/components/SharedComponents/Card";
import { useNewsletterForm } from "@/components/GenericPagesComponents/NewsletterForm";
import SummaryCard from "@/components/SharedComponents/Card/SummaryCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import NewsletterFormWrap from "@/components/GenericPagesComponents/NewsletterFormWrap";
import getPageProps from "@/node-lib/getPageProps";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const logMissingPortableTextComponents: MissingComponentHandler = (
  message,
  options,
) => {
  console.log(message, {
    type: options.type,
    nodeType: options.nodeType,
  });
};

export type ContactPageProps = {
  pageData: ContactPage;
};

const BodyHeading = styled(OakHeading)`
  &:first-child {
    margin-top: 0;
  }

  & + p {
    margin-top: 0;
  }
`;

const portableTextComponents: PortableTextComponents = {
  block: {
    sectionHeading: (props) => {
      return (
        <BodyHeading
          $font={"heading-5"}
          tag={"h2"}
          $mt="space-between-m2"
          $mb="space-between-ssx"
        >
          {props.children}
        </BodyHeading>
      );
    },
    normal: (props) => {
      return (
        <OakP $mt={["space-between-s", "space-between-m"]}>
          {props.children}
        </OakP>
      );
    },
  },
};

const ContactUs: NextPage<ContactPageProps> = ({ pageData }) => {
  const newsletterFormProps = useNewsletterForm();

  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <OakMaxWidth
        $pt={["inner-padding-xl7", "inner-padding-xl8"]}
        $pb={["inner-padding-xl6", "inner-padding-xl8"]}
      >
        <SummaryCard {...pageData} />
        <Card
          $justifyContent={"space-between"}
          $background={"pink50"}
          $ph={[16, 24]}
          $pv={[24]}
          $mt={[72, 80]}
          $font={["body-2", "body-1"]}
        >
          <BrushBorders hideOnMobileH color={"pink50"} />
          <OakFlex
            $alignItems={["flex-start", "center"]}
            $flexDirection={["column", "row"]}
          >
            <OakBox $maxWidth={"all-spacing-22"}>
              <PortableTextWithDefaults
                components={portableTextComponents}
                value={pageData.bodyPortableText}
                onMissingComponent={logMissingPortableTextComponents}
              />
            </OakBox>
            <NewsletterFormWrap
              {...newsletterFormProps}
              containerProps={{
                $display: ["none", "flex"],
                $minWidth: 360,
                $ml: 64,
              }}
            />
          </OakFlex>
        </Card>
        <NewsletterFormWrap
          {...newsletterFormProps}
          containerProps={{ $display: ["flex", "none"], $mt: 32 }}
        />
      </OakMaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<ContactPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "contact-us::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const pageData = await CMSClient.contactPage({
        previewMode: isPreviewMode,
      });

      if (!pageData) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<ContactPageProps> = {
        props: {
          pageData,
        },
      };

      return results;
    },
  });
};

export default ContactUs;
