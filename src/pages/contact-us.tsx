import React from "react";
import { NextPage } from "next";

import Typography, { Heading, P, Span } from "../components/Typography";
import Layout from "../components/Layout";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import Card from "../components/Card";
import Flex from "../components/Flex";
import NewsletterForm, {
  useNewsletterForm,
} from "../components/Forms/NewsletterForm";
import SummaryCard from "../components/Card/SummaryCard";
import Box from "../components/Box";
import { useCookieConsent } from "../browser-lib/cookie-consent/CookieConsentProvider";
import UnstyledButton from "../components/UnstyledButton";
import { getSeoProps } from "../browser-lib/seo/getSeoProps";
import BrushBorders from "../components/SpriteSheet/BrushSvgs/BrushBorders";
import OakLink from "../components/OakLink";

const ContactUs: NextPage = () => {
  const newsletterFormProps = useNewsletterForm();
  const { showConsentManager } = useCookieConsent();

  const data = {
    title: `Contact us`,
    heading: `We're here to help support you`,
    summaryPortableText: `You'll find options to get in touch with us here. We can only keep improving with your help, so whether it's a question, feedback or just an idea, we want to hear it.`,
    contactDetails: [
      {
        title: `Find help`,
        paragraph: (
          <>
            Search our FAQs and find useful information for teachers, schools,
            pupils and parents in our{" "}
            <a href={"https://support.thenational.academy"} target="_blank">
              help centre.
            </a>
          </>
        ),
      },
      {
        title: `Report a problem`,
        paragraph: (
          <>
            If you've found a technical problem or error with an Oak lesson
            please help us out by filling in{" "}
            <a
              href="https://support.thenational.academy/kb-tickets/new"
              target="_blank"
            >
              this short form
            </a>{" "}
            or submit a report via our feedback tool at the bottom right corner
            of the screen (look for the question mark).
          </>
        ),
      },
      {
        title: `General enquiries`,
        paragraph: (
          <>
            For general enquiries and help please email{" "}
            <a href="mailto:help@thenational.academy">
              help@thenational.academy
            </a>
            .
          </>
        ),
      },
      {
        title: `Media enquiries`,
        paragraph: (
          <>
            For media enquiries, please contact{" "}
            <a href="mailto:media@thenational.academy">
              media@thenational.academy
            </a>
            .
          </>
        ),
      },
      {
        title: `Privacy`,
        paragraph: (
          <>
            <P>
              At Oak National Academy we're committed to protecting the data of
              all our users. We always treat your data in accordance with our{" "}
              <OakLink page="privacy-policy">privacy policy</OakLink>.
            </P>
            <P $mt={[16, 24]}>
              You can make a subject access request to us if you wish to amend
              or delete any data we hold about you. If you have a complaint,
              concern or subject access request you can email{" "}
              <a href="mailto:privacy@thenational.academy">
                privacy@thenational.academy
              </a>
              .
            </P>
            <P $mt={[16, 24]}>
              You can customise your cookie preferences across Oak National
              Academy. These can be changed at any time.{" "}
              <UnstyledButton onClick={showConsentManager}>
                <Span $color="hyperlink">Manage cookie settings.</Span>
              </UnstyledButton>
            </P>
          </>
        ),
      },
    ],
    seo: {
      title: "Contact us",
      description: `We love to help and always welcome any feedback too. You'll find options to get in touch with us here.`,
    },
  };

  const { title, heading, summaryPortableText, contactDetails } = data;

  return (
    <Layout seoProps={getSeoProps(data.seo)} $background={"white"}>
      <MaxWidth $pt={[72, 80]} $pb={[64, 92]}>
        <SummaryCard
          title={title}
          heading={heading}
          summary={summaryPortableText}
        />
        <Card
          $justifyContent={"space-between"}
          $background={"twilight"}
          $ph={[16, 24]}
          $pv={[24]}
          $mt={[72, 80]}
        >
          <BrushBorders hideOnMobileH color={"twilight"} />
          <Flex
            $alignItems={["flex-start", "center"]}
            $flexDirection={["column", "row"]}
          >
            <Box $maxWidth={720}>
              {contactDetails.map((section, i) => {
                return (
                  <Flex
                    $flexDirection={"column"}
                    $mt={i !== 0 ? 32 : 0}
                    key={`contact-us-contact-details-section-${i}`}
                  >
                    <Heading $font={"heading-5"} tag={"h3"} $mb={8}>
                      {section.title}
                    </Heading>
                    <Typography>{section.paragraph}</Typography>
                  </Flex>
                );
              })}
            </Box>
            <NewsletterForm
              {...newsletterFormProps}
              containerProps={{
                $display: ["none", "flex"],
                $minWidth: 360,
                $ml: 64,
              }}
            />
          </Flex>
        </Card>
        <NewsletterForm
          {...newsletterFormProps}
          containerProps={{ $display: ["flex", "none"], $mt: 32 }}
        />
      </MaxWidth>
    </Layout>
  );
};

export default ContactUs;
