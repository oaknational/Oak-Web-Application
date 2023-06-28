import React from "react";
import { GetStaticProps, GetStaticPropsResult, NextPage } from "next";
import styled from "styled-components";
import {
  MissingComponentHandler,
  PortableText,
  PortableTextComponents,
} from "@portabletext/react";

import CMSClient from "../node-lib/cms";
import { ContactPage } from "../common-lib/cms-types";
import { Heading, P } from "../components/Typography";
import Layout from "../components/Layout";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import Card from "../components/Card";
import Flex from "../components/Flex";
import { useNewsletterForm } from "../components/Forms/NewsletterForm";
import SummaryCard from "../components/Card/SummaryCard";
import Box from "../components/Box";
import { getSeoProps } from "../browser-lib/seo/getSeoProps";
import BrushBorders from "../components/SpriteSheet/BrushSvgs/BrushBorders";
import NewsletterFormWrap from "../components/Forms/NewsletterForm/NewsletterFormWrap";
import { BasePortableTextProvider } from "../components/PortableText";
import getPageProps from "../node-lib/getPageProps";

export type ContactPageProps = {
  pageData: ContactPage;
};

// @TODO: extract
const logMissingPortableTextComponents: MissingComponentHandler = (
  message,
  options
) => {
  console.log(message, {
    type: options.type,
    nodeType: options.nodeType,
  });
};

const BodyHeading = styled(Heading)`
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
        <BodyHeading $font={"heading-5"} tag={"h2"} $mt={32} $mb={8}>
          {props.children}
        </BodyHeading>
      );
    },
    normal: (props) => {
      return <P $mt={[16, 24]}>{props.children}</P>;
    },
  },
};

const ContactUs: NextPage<ContactPageProps> = ({ pageData }) => {
  const newsletterFormProps = useNewsletterForm();

  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <MaxWidth $pt={[72, 80]} $pb={[64, 92]}>
        <SummaryCard {...pageData} />
        <Card
          $justifyContent={"space-between"}
          $background={"twilight"}
          $ph={[16, 24]}
          $pv={[24]}
          $mt={[72, 80]}
          $font={["body-2", "body-1"]}
        >
          <BrushBorders hideOnMobileH color={"twilight"} />
          <Flex
            $alignItems={["flex-start", "center"]}
            $flexDirection={["column", "row"]}
          >
            <Box $maxWidth={720}>
              <BasePortableTextProvider>
                <PortableText
                  components={portableTextComponents}
                  value={pageData.bodyPortableText}
                  onMissingComponent={logMissingPortableTextComponents}
                />
              </BasePortableTextProvider>
            </Box>
            <NewsletterFormWrap
              {...newsletterFormProps}
              containerProps={{
                $display: ["none", "flex"],
                $minWidth: 360,
                $ml: 64,
              }}
            />
          </Flex>
        </Card>
        <NewsletterFormWrap
          {...newsletterFormProps}
          containerProps={{ $display: ["flex", "none"], $mt: 32 }}
        />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<ContactPageProps> = async (
  context
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
