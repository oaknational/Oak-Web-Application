import { PortableText, PortableTextComponents } from "@portabletext/react";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { useId } from "react-aria";

import Card from "../components/Card";
import Cover from "../components/Cover";
import FixedHeader from "../components/FixedHeader";
import Flex from "../components/Flex";
import Grid, { GridArea } from "../components/Grid";
import Icon from "../components/Icon";
import Logo from "../components/Logo";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import { BasePortableTextProvider } from "../components/PortableText";
import SiteFooter from "../components/SiteFooter";
import Typography, { Heading, P } from "../components/Typography";
import { CTA, TextAndMedia, PortableTextJSON } from "../node-lib/cms";
import {
  createPortableListItem,
  portableTextFromString,
} from "../__tests__/__helpers__/cms";
import OutlineHeading from "../components/OutlineHeading";
import BrushBorders from "../components/SpriteSheet/BrushSvgs/BrushBorders";
import NewsletterForm, {
  useNewsletterForm,
} from "../components/Forms/NewsletterForm";

type LandingPageHero = {
  title: string;
  heading: string;
  cta?: CTA;
  media?: null; // let's ignore for now
};

type LandingPageMediaBlock = { _type: "textAndMedia" } & TextAndMedia;

type LandingPageFormBlock = {
  _type: "form";
  title: string;
  bodyPortableText: PortableTextJSON /* form hard-coded for now */;
};

type LandingPageTextBlock = {
  _type: "text";
  bodyPortableText: PortableTextJSON;
};

type LandingPageQuoteBlock = { _type: "quote" } & {
  text: string;
  attribution: string;
  role: string;
};

type LandingPageBlock =
  | LandingPageMediaBlock
  | LandingPageFormBlock
  | LandingPageTextBlock
  | LandingPageQuoteBlock;

type LandingPage = {
  hero: LandingPageHero;
  content: LandingPageBlock[];
};

const mockData: LandingPage = {
  hero: {
    title: "Download our Lesson & Resource Directory",
    heading:
      "Get a complete list of every one of our resources and save time searching",
    // cta: {
    //   label: "Lesson & Resource Directory",
    // },
  },
  content: [
    {
      _type: "textAndMedia",
      alignMedia: "left",
      title: "",
      bodyPortableText: [
        createPortableListItem(
          "1. Instantly see all subjects, units and lessons available for each key stage."
        ),
        createPortableListItem(
          "2. Quickly search and filter for lessons with downloadable resources."
        ),
        createPortableListItem(
          "3. Ideal for setting last-minute cover or saving time when planning."
        ),
      ],
      mediaType: "image",
      image: {
        asset: {
          _id: "000",
          url: "/images/illustrations/planning.svg",
        },
      },
    },
    {
      _type: "text",
      bodyPortableText: portableTextFromString(
        "Instantly see all subjects, units and lessons available for each key stage with our Lesson & Resource Directory: a downloadable document detailing every single one of the 40,000 resources we have available in our Teacher Hub."
      ),
    },
    {
      _type: "form",
      title: "Get your copy of the directory",
      bodyPortableText: portableTextFromString(
        "Add your email below and we'll send you the Oak Lesson & Resource Directory and other helpful updates and resources. Unsubscribe at any time. Read our privacy policy."
      ),
    },
    {
      _type: "quote",
      text: "I can literally just send a link to the lesson, and that's the entire workload.",
      attribution: "Antonia Kielkowska",
      role: "Science Teacher",
    },
  ],
};

type LandingPageProps = {
  pageData: LandingPage;
};

const LandingPageTitle: FC<{
  title: string;
  heading: string;
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
        {...props}
      >
        {props.title}
      </Heading>
      <Heading
        $mv={[0]}
        $fontSize={[24, 32]}
        $fontFamily={"heading"}
        tag="h2"
        $textAlign={["left", "center"]}
        {...props}
      >
        {props.heading}
      </Heading>
    </Flex>
  );
};

const SignUpForm: FC = () => {
  const { onSubmit } = useNewsletterForm();
  const id = useId();
  const descriptionId = `${id}-newsletter-form-description`;
  return (
    <Card
      $ml={[0, 48]}
      $width={["100%"]}
      $pv={40}
      $background={"white"}
      $dropShadow={"notificationCard"}
    >
      <Heading $fontSize={[20, 24]} tag="h3" $mb={0}>
        Directory sign-up
      </Heading>
      <NewsletterForm
        onSubmit={onSubmit}
        id={id}
        descriptionId={descriptionId}
      />
    </Card>
  );
};

const SignupPrompt: FC<{ title: string; portableText: PortableTextJSON }> = ({
  title,
  portableText,
}) => {
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
            <PortableText value={portableText} />
          </Typography>
        </GridArea>
        <GridArea $colSpan={[12, 4]} $colStart={[1, 7]}>
          <SignUpForm />
        </GridArea>
      </Grid>
    </>
  );
};

const Quote: FC<{ text: string; author: string }> = ({ text, author }) => {
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
        {text}
      </Heading>
      <Typography $fontFamily={"body"} $fontSize={[16]}>
        {author}
      </Typography>
    </Flex>
  );
};

const lessonDirectoryPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => {
      return <Typography $fontSize={[18]}>{children}</Typography>;
    },
  },
  types: {
    textAndMedia: (props) => {
      return (
        <Card
          $flexDirection={["column", "row"]}
          $background={"teachersPastelYellow"}
          $width={"100%"}
          $ph={[0, 24]}
          $mb={[56, 92]}
          $maxHeight={600}
          $pb={0}
        >
          <BrushBorders hideOnMobileH color={"teachersPastelYellow"} />

          <Flex
            $position="relative"
            $minWidth={["100%", "50%"]}
            $minHeight={[172, 240]}
            $mv={24}
          >
            <Cover>
              <Image
                alt={""}
                src={"/images/illustrations/magic-carpet.png"}
                layout="fill"
                objectFit="contain"
                objectPosition={"center"}
                priority
              />
            </Cover>
          </Flex>
          <Flex $justifyContent={"center"} $flexDirection={"column"}>
            <PortableText value={props.value.bodyPortableText} />
          </Flex>
        </Card>
      );
    },
    text: (props) => {
      return (
        <Flex $ph={[16]} $justifyContent={"center"} $mb={[56, 92]}>
          <Typography $maxWidth={720} $fontSize={[16, 18]}>
            <PortableText value={props.value.bodyPortableText} />
          </Typography>
        </Flex>
      );
    },
    quote: (props) => {
      return <Quote author={props.value.attribution} text={props.value.text} />;
    },
    form: (props) => {
      return (
        <SignupPrompt
          title={props.value.title}
          portableText={props.value.bodyPortableText}
        />
      );
    },
  },
  listItem: {
    number: (props) => {
      const listItemText = props?.value?.children[0]?.text;
      const number = listItemText?.[0];
      const remainingText = listItemText?.slice(3);

      return (
        <Flex $mb={[48]} $alignItems={"center"}>
          <OutlineHeading
            $color={"teachersPastelYellow"}
            $mr={[24]}
            $fontSize={50}
            tag={"h2"}
          >
            {number}
          </OutlineHeading>
          <P $fontFamily={"heading"} $fontSize={[16, 20]} $lineHeight={"24px"}>
            {remainingText}
          </P>
        </Flex>
      );
    },
  },
};

const LessonAndResourceDirectory: NextPage<LandingPageProps> = ({
  pageData,
}) => {
  return (
    <>
      <FixedHeader $background={"white"}>
        <Flex
          $alignItems={"center"}
          $width={"100%"}
          $justifyContent={"space-between"}
        >
          <Link href={"/"}>
            <a>
              <Logo title={"Oak National Academy"} height={48} width={104} />
            </a>
          </Link>
          <Link href={"#signup-form"}>
            <a>
              <Flex
                $width={[200, "100%"]}
                $justifyContent={"flex-end"}
                $alignItems={"center"}
              >
                <Typography
                  $textAlign="right"
                  $fontFamily={"heading"}
                  $fontSize={16}
                >
                  Lesson & Resource Directory CTA
                </Typography>
                <Icon
                  $ml={12}
                  aria-label={"arrow-right"}
                  name={"ArrowRight"}
                  $background={"teachersHighlight"}
                  $color={"white"}
                  variant={"brush"}
                  size={28}
                />
              </Flex>
            </a>
          </Link>
        </Flex>
      </FixedHeader>
      <MaxWidth $justifyContent={"flex-start"}>
        <LandingPageTitle {...pageData.hero} />
        <BasePortableTextProvider>
          <PortableText
            components={lessonDirectoryPortableTextComponents}
            value={pageData.content}
          />
        </BasePortableTextProvider>
      </MaxWidth>
      <SiteFooter />
    </>
  );
};

export const getStaticProps: GetStaticProps<LandingPageProps> = async () => {
  return {
    props: {
      pageData: mockData,
    },
    revalidate: 10,
  };
};

export default LessonAndResourceDirectory;
