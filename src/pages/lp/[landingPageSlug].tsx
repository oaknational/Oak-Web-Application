import { PortableText } from "@portabletext/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { FC } from "react";
import { useId } from "react-aria";
import styled from "styled-components";

import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import Card from "../../components/Card";
import Flex from "../../components/Flex";
import NewsletterForm, {
  useNewsletterForm,
} from "../../components/Forms/NewsletterForm";
import Grid, { GridArea } from "../../components/Grid";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import { BasePortableTextProvider } from "../../components/PortableText";
import BrushBorders from "../../components/SpriteSheet/BrushSvgs/BrushBorders";
import Typography, { Heading, LI, OL } from "../../components/Typography";
import CMSClient, { PortableTextJSON, TextAndMedia } from "../../node-lib/cms";
import { LandingPage } from "../../node-lib/cms/sanity-client/schemas/landingPage";
import { QuoteSchema } from "../../node-lib/cms/sanity-client/schemas/blocks";
import AnchorTarget from "../../components/AnchorTarget";
import { OakColorName } from "../../styles/theme/types";
import { outlineShadow } from "../../components/OutlineHeading/OutlineHeading";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import CMSImage from "../../components/CMSImage";
import CMSVideo from "../../components/CMSVideo";
import CardTitle from "../../components/Card/CardComponents/CardTitle";
import Box from "../../components/Box";

const OLOutline = styled(OL)<{ $color: OakColorName }>`
  & div:last-child {
    margin-bottom: 0;
  }

  & li::before {
    position: absolute;
    top: 12px;
    left: 0;
    font-weight: 600;
    padding-right: 4px;
    text-indent: -32px;
    content: counter(item);
    font-size: 50px;
    color: ${(props) => getColorByName(props.$color)};
    text-shadow: ${outlineShadow};
  }

  a {
    color: ${(props) => props.theme.colors.hyperlink};
  }
`;

export type LandingPageProps = {
  pageData: LandingPage;
};

const LandingPageTitle: FC<{
  title: string;
  heading?: string | null;
}> = (props) => {
  return (
    <Flex
      $maxWidth={840}
      $mv={[92]}
      $flexDirection={"column"}
      $alignItems={["flex-start", "center"]}
      $ph={16}
    >
      <Heading
        $mb={[8]}
        $fontSize={[20, 24]}
        $color={"grey6"}
        $fontFamily={"heading"}
        tag="h1"
      >
        {props.title}
      </Heading>
      {props.heading && (
        <Heading
          $mv={[0]}
          $fontSize={[24, 32]}
          $fontFamily={"heading"}
          tag="h2"
          $textAlign={["left", "center"]}
        >
          {props.heading}
        </Heading>
      )}
    </Flex>
  );
};

const SignUpForm: FC<{ formTitle: string }> = ({ formTitle }) => {
  const { onSubmit } = useNewsletterForm();
  const id = useId();
  const descriptionId = `${id}-newsletter-form-description`;
  return (
    <Card
      $ml={[0, 48]}
      $width={["100%"]}
      $pv={40}
      $ph={[16, 24]}
      $background={"white"}
      $dropShadow={"notificationCard"}
    >
      <AnchorTarget id={"newsletter-form"} />

      <CardTitle icon="MagicCarpet" fontSize={[20, 24]} tag="h3">
        {formTitle}
      </CardTitle>
      <Box $mt={12}>
        <NewsletterForm
          onSubmit={onSubmit}
          id={id}
          descriptionId={descriptionId}
        />
      </Box>
    </Card>
  );
};

const SignupPrompt: FC<{
  title: string;
  formTitle: string;
  bodyPortableText: PortableTextJSON;
}> = ({ title, bodyPortableText, formTitle }) => {
  return (
    <>
      <Grid $mb={[120, 92]} $cg={[8]}>
        <GridArea
          $colSpan={[12, 5]}
          $colStart={[1, 2]}
          $width={"100%"}
          $alignItems={"flex-start"}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={[16, 0]}
          $mb={[56, 0]}
        >
          <Heading
            $fontFamily={"heading"}
            tag={"h4"}
            $fontSize={[24, 32]}
            $mb={[32]}
          >
            {title}
          </Heading>
          <Typography $fontSize={[16, 18]}>
            <PortableText value={bodyPortableText} />
          </Typography>
        </GridArea>
        <GridArea $colSpan={[12, 4]} $colStart={[1, 7]}>
          <SignUpForm formTitle={formTitle} />
        </GridArea>
      </Grid>
    </>
  );
};

const Quote: FC<QuoteSchema> = ({ text, attribution }) => {
  return (
    <Flex
      $flexDirection={"column"}
      $justifyContent={"center"}
      $alignItems={"center"}
      $mb={[56, 92]}
      $ph={[16]}
      $maxWidth={[720]}
    >
      <Heading
        $fontFamily={"headingLight"}
        tag={"h3"}
        $mb={[16]}
        $fontSize={[32]}
        $textAlign={"center"}
      >
        "{text}"
      </Heading>
      <Typography $fontFamily={"body"} $fontSize={[16]}>
        {attribution}
      </Typography>
    </Flex>
  );
};

const LandingPageTextBlock: FC<{
  bodyPortableText: PortableTextJSON;
}> = (props) => {
  return (
    <Flex $ph={[16]} $justifyContent={"center"} $mb={[56, 92]}>
      <Typography $maxWidth={720} $fontSize={[16, 18]}>
        <PortableText value={props.bodyPortableText} />
      </Typography>
    </Flex>
  );
};

const LandingPageTextAndMedia = (props: TextAndMedia) => {
  return (
    <Card
      $flexDirection={["column", "row"]}
      $background={"teachersPastelYellow"}
      $width={"100%"}
      $mb={[56, 92]}
      $maxHeight={600}
      $pb={24}
      $ph={[16, 24]}
    >
      <BrushBorders hideOnMobileH color={"teachersPastelYellow"} />

      <Flex $position="relative" $minWidth={["100%", "50%"]} $mb={[40, 0]}>
        {props.mediaType == "image" && (
          <CMSImage
            $pr={[0, 24, 72]}
            alt={props.image.altText || ""}
            $objectFit="contain"
            $objectPosition={"center"}
            fill
            priority
            image={props.image}
          />
        )}
        {props.mediaType == "video" && (
          <Flex $alignItems={"center"} $ph={20}>
            <CMSVideo video={props.video} />
          </Flex>
        )}
      </Flex>
      <Flex
        $minWidth={["100%", "50%"]}
        $justifyContent={"center"}
        $flexDirection={"column"}
      >
        <PortableText
          components={{
            list: {
              number: (props) => (
                <OLOutline $color={"teachersPastelYellow"} $mh={0}>
                  {props.children}
                </OLOutline>
              ),
            },

            listItem: {
              number: (props) => {
                const listItemText = props?.value?.children[0]?.text;

                return (
                  <Flex $position={"relative"} $mb={48} $alignItems={"center"}>
                    <LI
                      $fontFamily={"heading"}
                      $fontSize={[16, 20]}
                      $lineHeight={"24px"}
                    >
                      {listItemText}
                    </LI>
                  </Flex>
                );
              },
            },
          }}
          value={props.bodyPortableText}
        />
      </Flex>
    </Card>
  );
};

const Landing: NextPage<LandingPageProps> = ({ pageData }) => {
  return (
    <Layout
      headerVariant="landingPages"
      headerProps={pageData.landingPageHeader}
      seoProps={getSeoProps(pageData.seo)}
    >
      <>
        <MaxWidth $justifyContent={"flex-start"}>
          <LandingPageTitle title={pageData.title} heading={pageData.heading} />

          <BasePortableTextProvider>
            {pageData.content.map((content) => {
              if (content.type == "LandingPageTextAndMediaBlock") {
                return <LandingPageTextAndMedia {...content.textAndMedia} />;
              }
              if (content.type == "Quote") {
                return <Quote {...content} />;
              }
              if (content.type == "LandingPageFormBlock") {
                return <SignupPrompt {...content} />;
              }
              if (content.type == "LandingPageTextBlock") {
                return <LandingPageTextBlock {...content} />;
              }
            })}
          </BasePortableTextProvider>
        </MaxWidth>
      </>
    </Layout>
  );
};

type URLParams = {
  landingPageSlug: string;
};

export const getStaticPaths: GetStaticPaths<URLParams> = async () => {
  const landingResults = await CMSClient.landingPages();

  const paths = landingResults.map((landingPage) => ({
    params: { landingPageSlug: landingPage.slug },
  }));

  return {
    fallback: false,
    paths,
  };
};

export const getStaticProps: GetStaticProps<
  LandingPageProps,
  URLParams
> = async (context) => {
  const isPreviewMode = context.preview === true;

  const landingPageSlug = context?.params?.landingPageSlug as string;
  const landingPageResult = await CMSClient.landingPageBySlug(landingPageSlug, {
    previewMode: isPreviewMode,
  });

  if (!landingPageResult) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: landingPageResult,
    },
    revalidate: 10,
  };
};

export default Landing;
