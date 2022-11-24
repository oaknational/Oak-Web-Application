import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";

import CMSClient from "../node-lib/cms";
import { SupportPage } from "../common-lib/cms-types";
import { decorateWithIsr } from "../node-lib/isr";
import Layout from "../components/Layout";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import SummaryCard from "../components/Card/SummaryCard";
import { Heading, P } from "../components/Typography";
import Flex from "../components/Flex";
import Grid from "../components/Grid";
import GridArea from "../components/Grid/GridArea";
import { getSeoProps } from "../browser-lib/seo/getSeoProps";
import { TextBlockCard } from "../components/Sanity/TextBlock/TextBlockCard";
import TextBlockCardImageCta from "../components/Sanity/TextBlock/TextBlockCardImageCta";
import BubbleMessage from "../components/BubbleMessage";
import ButtonAsLink from "../components/Button/ButtonAsLink";
import Box from "../components/Box";

export type SupportPageProps = {
  pageData: SupportPage;
};

const Support: NextPage<SupportPageProps> = ({ pageData }) => {
  return (
    <Layout seoProps={getSeoProps(pageData.seo)} $background={"white"}>
      <MaxWidth $ph={[0, 16]} $pt={[64, 80]}>
        <SummaryCard
          title={pageData.title}
          heading={pageData.heading}
          summary={pageData.summaryPortableText}
          imageProps={{
            src: "/images/illustrations/work-with-us-500.png",
            alt: "planning illustration",
          }}
        />
        <Flex
          $justifyContent="center"
          $maxWidth={["100%", 450]}
          $mh="auto"
          $pt={64}
          $pb={96}
          $ph={12}
        >
          <Heading
            $font={["heading-5", "heading-4"]}
            $textAlign="center"
            tag="h2"
          >
            Using Oak in your school could have a big impact
          </Heading>
        </Flex>
        <Flex $justifyContent={"center"}>
          <Flex $flexDirection={["column", "row", "row"]}>
            <BubbleMessage
              background={"pastelTurquoise"}
              variant="Bubble"
              outlineHeading={"3 hrs"}
              heading={"per week saved on lesson planning"}
              subHeading={"by nearly half of teachers using Oak"}
            />
            <BubbleMessage
              background={"twilight"}
              variant="Bubble2"
              outlineHeading={"50%"}
              heading={"of teachers feel more confident"}
              subHeading={"in curriculum design"}
              $mr={[0, -8, 8]}
            />
          </Flex>
        </Flex>
        <Flex $justifyContent={"center"}>
          <ButtonAsLink
            $mt={32}
            $mb={92}
            page={"teachers-home"}
            label={"Search our lessons"}
            icon={"ArrowRight"}
            $iconPosition={"trailing"}
          />
        </Flex>
        <Grid $mb={56} $rg={56} $cg={[0, 40]}>
          <GridArea $colSpan={[12, 12, 6]}>
            <TextBlockCard
              background={"teachersPastelYellow"}
              {...pageData.planning}
            />
          </GridArea>
          <GridArea $colSpan={[12, 12, 6]}>
            <TextBlockCard
              background={"teachersPastelYellow"}
              {...pageData.cover}
            />
          </GridArea>
        </Grid>
        <TextBlockCardImageCta
          {...pageData.curriculum}
          background={"pastelTurquoise"}
          image={{
            imageSrc: "/images/illustrations/curriculum-371.png",
            alt: "develop your curriculum illustration",
          }}
        />
        <TextBlockCardImageCta
          {...pageData.development}
          background={"twilight"}
          image={{
            imageSrc: "/images/illustrations/work-with-us-500.png",
            alt: "illustration of four people carrying a floor, on which people are working at desks, and one person is painting at an easel",
          }}
          imageContainerProps={{
            $maxHeight: [null, null, 150],
          }}
        />
        <Flex
          $alignItems={"center"}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $mt={48}
        >
          <Heading $font={["heading-5", "heading-4"]} $mb={20} tag={"h2"}>
            Start using Oak today
          </Heading>
          <Box $width={360}>
            <P $textAlign={"center"} $font={"body-2"}>
              Search our lessons to find all the resources you need to support
              your team.
            </P>
          </Box>
          <Flex $justifyContent={"center"}>
            <ButtonAsLink
              $mt={32}
              $mb={92}
              page={"teachers-home"}
              label={"Search our lessons"}
              icon={"ArrowRight"}
              $iconPosition={"trailing"}
            />
          </Flex>
        </Flex>
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<SupportPageProps> = async (
  context
) => {
  const isPreviewMode = context.preview === true;

  const supportPage = await CMSClient.supportPage({
    previewMode: isPreviewMode,
  });

  if (!supportPage) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<SupportPageProps> = {
    props: {
      pageData: supportPage,
    },
  };
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default Support;
