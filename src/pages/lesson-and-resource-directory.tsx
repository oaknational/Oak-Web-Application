import { PortableText, PortableTextComponents } from "@portabletext/react";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import CardTitle from "../components/Card/CardComponents/CardTitle";
import Cover from "../components/Cover";
import FixedHeader from "../components/FixedHeader";
import Flex from "../components/Flex";
import Grid, { GridArea } from "../components/Grid";
import Input from "../components/Input";
import Logo from "../components/Logo";
import MaxWidth from "../components/MaxWidth/MaxWidth";
import { BasePortableTextProvider } from "../components/PortableText";
import Typography, { Heading } from "../components/Typography";
import { CTA, TextAndMedia, PortableTextJSON } from "../node-lib/cms";
import {
  createPortableListItem,
  portableTextFromString,
} from "../__tests__/__helpers__/cms";

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
    //   label: "Some form of CTA",
    //   linkType: 'external',
    //   external: '#anchor'
    // },
  },
  content: [
    {
      _type: "textAndMedia",
      alignMedia: "left",
      title: "",
      bodyPortableText: [
        createPortableListItem(
          "Instantly see all subjects, units and lessons available for each key stage."
        ),
        createPortableListItem(
          "Quickly search and filter for lessons with downloadable resources."
        ),
        createPortableListItem(
          "Ideal for setting last-minute cover or saving time when planning."
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

const LandingPageHeader: FC<{
  title: string;
  heading: string;
}> = (props) => {
  return (
    <Flex
      $justifyContent={"center"}
      $mv={[92]}
      $flexDirection={"column"}
      $alignItems={"center"}
    >
      <Heading
        $mb={[8]}
        $fontSize={[24]}
        $color={"grey6"}
        $fontFamily={"headingLight"}
        tag="h4"
        {...props}
      >
        {props.title}
      </Heading>
      <Heading
        $mv={[0]}
        $fontSize={[32]}
        $fontFamily={"headingLight"}
        tag="h5"
        {...props}
      >
        {props.heading}
      </Heading>
    </Flex>
  );
};

const SignUpForm: FC = () => {
  return (
    <Card $background={"white"} $dropShadow={"notificationCard"}>
      <CardTitle tag="h2">Directory sign-up</CardTitle>
      <form>
        <Input id="name" label="Name" $mt={24} placeholder={"Name"} />
        <Input id="email" label="Email" $mt={24} placeholder={"Email"} />
        <Input
          id="role"
          label="Role"
          $mt={24}
          placeholder={"What describes you best ?"}
        />
        <Button
          $mt={24}
          label="Sign up"
          fullWidth
          background="teachersHighlight"
        />
      </form>
    </Card>
  );
};

const SignupPrompt: FC<{ title: string; portableText: PortableTextJSON }> = ({
  title,
  portableText,
}) => {
  return (
    <>
      <Grid $mb={[92]} $cg={[12]}>
        <GridArea
          $colSpan={[3]}
          $colStart={4}
          $width={"100%"}
          $alignItems={"flex-start"}
          $justifyContent={"center"}
          $flexDirection={"column"}
        >
          <Heading tag={"h4"} $fontSize={[32]} $mb={[32]}>
            {title}
          </Heading>
          <Typography $fontSize={[18]}>
            <PortableText value={portableText} />
          </Typography>
        </GridArea>
        <GridArea $colSpan={[3]} $colStart={7}>
          <SignUpForm />
        </GridArea>
      </Grid>
    </>
  );
};

const Quote: FC<{ text: string; author: string }> = ({ text, author }) => {
  return (
    <MaxWidth $width={[720]}>
      <Flex
        $flexDirection={"column"}
        $justifyContent={"center"}
        $alignItems={"center"}
        $mb={[92]}
      >
        <Heading tag={"h3"} $mb={[16]} $fontSize={[16]}>
          {text}
        </Heading>
        <Typography $fontSize={[16]}>{author}</Typography>
      </Flex>
    </MaxWidth>
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
      console.log(props.value.image.asset.url, "url");
      return (
        <MaxWidth>
          <Card $mb={[92]} $width={"100%"} $background={"teachersPastelYellow"}>
            <Flex $justifyContent={"space-between"}>
              <Cover>
                <Image
                  alt={""}
                  src={"/images/illustrations/magic-carpet.png"}
                  layout="fill"
                  objectFit="contain"
                  objectPosition={"left"}
                  priority
                />
              </Cover>
            </Flex>
            <Flex $justifyContent={"end"}>
              <PortableText value={props.value.bodyPortableText} />
            </Flex>
          </Card>
        </MaxWidth>
      );
    },
    text: (props) => {
      return (
        <MaxWidth $width={[720]}>
          <Flex $justifyContent={"center"} $mb={[92]}>
            <Typography $fontSize={[18]}>
              <PortableText value={props.value.bodyPortableText} />
            </Typography>
          </Flex>
        </MaxWidth>
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
};

const LessonAndResourceDirectory: NextPage<LandingPageProps> = ({
  pageData,
}) => {
  return (
    <>
      <FixedHeader $background={"white"}>
        <Link href={"/"}>
          <a>
            <Logo title={"Oak National Academy"} height={48} width={104} />
          </a>
        </Link>
      </FixedHeader>
      <MaxWidth>
        <LandingPageHeader {...pageData.hero} />
        <BasePortableTextProvider>
          <PortableText
            components={lessonDirectoryPortableTextComponents}
            value={pageData.content}
          />
        </BasePortableTextProvider>
      </MaxWidth>
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
