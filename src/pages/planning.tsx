import { FC } from "react";
import styled from "styled-components";
import Link from "next/link";
import { PortableText } from "@portabletext/react";

import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Card from "../components/Card";
import Flex from "../components/Flex";
import Grid, { GridArea } from "../components/Grid";
import Layout from "../components/Layout";
import { Heading, P } from "../components/Typography";
import ButtonAsLink from "../components/Button/ButtonAsLink";
import { getBreakpoint } from "../styles/utils/responsive";
import Icon from "../components/Icon";
import LessonProgressionGraphic from "../components/LessonProgressionGraphic";
import { IconName } from "../components/Icon/Icon";
import doc from "../browser-lib/fixtures/lessonPlanning.json";

const SpanLink = styled.span`
  scroll-margin-top: ${({ theme }) => theme.header.height + 12}px;

  @media (max-width: ${getBreakpoint("small")}px) {
    scroll-margin-top: ${({ theme }) => theme.header.height + 92}px;
  }
`;
const RoundedImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 5px;

  @media (max-width: ${getBreakpoint("small")}px) {
    width: 80px;
    height: 80px;
  }
`;

const CircleIconContainer = styled(Flex)`
  width: 124px;
  height: 124px;
`;

type LessonPlanningCardProps = {
  title: string;
  icon: IconName;
  pageAnchorId: string;
};

const LessonPlanningCard: FC<LessonPlanningCardProps> = ({
  title,
  icon,
  children,
  pageAnchorId,
}) => {
  console.log(doc);
  return (
    <Card
      alignItems={"center"}
      flexDirection={["row", "column"]}
      ph={[0, 12]}
      background={"powderBlue"}
    >
      <SpanLink id={pageAnchorId}></SpanLink>
      <CircleIconContainer
        background={"madangGreen"}
        borderRadius={100}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Icon size={80} name={icon} />
      </CircleIconContainer>
      <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
        <Heading mb={24} tag={"h3"} fontSize={[16, 24]}>
          {title}
        </Heading>
        <P fontSize={[14, 16]}>{children}</P>
      </Flex>
    </Card>
  );
};

const PlanALesson: FC = () => {
  return (
    <Layout seoProps={DEFAULT_SEO_PROPS} background={"grey1"}>
      <Grid cg={24} rg={[16, 48, 80]}>
        <GridArea colSpan={[12, 12, 12]}>
          <Card mt={[72, 80, 80]} mb={[40, 80, 80]} background={"madangGreen"}>
            <Heading
              mb={16}
              tag={"h2"}
              fontSize={20}
              lineHeight={24}
              color={"grey4"}
            >
              {doc.title}
            </Heading>
            <Heading
              mb={16}
              color={"black"}
              fontSize={[24, 32, 32]}
              lineHeight={40}
              tag={"h1"}
            >
              {doc.heading}
            </Heading>
            <P color={"black"} fontSize={16}>
              <PortableText value={doc.summaryPortableText}></PortableText>
            </P>
          </Card>
        </GridArea>

        <GridArea colSpan={[12, 12, 12]}>
          <Flex flexDirection={"column"} justifyContent={"center"}>
            <Heading
              textAlign="center"
              color={"black"}
              lineHeight={32}
              fontSize={[16, 24, 24]}
              tag={"h3"}
              mb={[32, 80, 80]}
            >
              Elements of a lesson
            </Heading>
            <LessonProgressionGraphic></LessonProgressionGraphic>
          </Flex>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <LessonPlanningCard
            title={doc.lessonElements.introQuiz.title}
            icon={"Quiz"}
            pageAnchorId={"intro-quiz"}
          >
            <PortableText
              value={doc.lessonElements.introQuiz.bodyPortableText}
            ></PortableText>
          </LessonPlanningCard>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <LessonPlanningCard
            title={"Lesson slides"}
            icon={"LessonSlides"}
            pageAnchorId={"lesson-slides"}
          >
            Help your pupils retrieve or activate prior knowledge with our intro
            quizzes. Project them in your classroom, or print them off as
            worksheets to use in class or as homework.
          </LessonPlanningCard>
          <Card
            alignItems={"center"}
            flexDirection={["row", "column"]}
            ph={[0, 12]}
            background={"powderBlue"}
          >
            <SpanLink id="lesson-slides"></SpanLink>
            <CircleIconContainer
              background={"madangGreen"}
              borderRadius={100}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Link href={"/"}>
                <Icon size={80} name={"Quiz"} />
              </Link>
            </CircleIconContainer>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading mb={24} tag={"h3"} fontSize={[16, 24]}>
                Lesson Slides
              </Heading>
              <P fontSize={[14, 16]}>
                The majority of our lesson slides can be downloaded and edited.
                Use them as a foundation for your own lesson plans, and adapt
                them to make them your own.
              </P>
            </Flex>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={["row", "column"]}
            ph={[0, 12]}
            background={"powderBlue"}
          >
            <SpanLink id="worksheets"></SpanLink>
            <CircleIconContainer
              background={"madangGreen"}
              borderRadius={100}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Link href={"/"}>
                <Icon size={80} name={"Quiz"} />
              </Link>
            </CircleIconContainer>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading mb={24} tag={"h3"} fontSize={[16, 24]}>
                Worksheets
              </Heading>
              <P fontSize={[14, 16]}>
                Our lesson worksheets help your pupils practise key lesson
                content, and support your planning for questions and tasks. Use
                them in the classroom, for homework and revision.
              </P>
            </Flex>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={["row", "column"]}
            ph={[0, 12]}
            background={"powderBlue"}
          >
            <SpanLink id="video"></SpanLink>
            <CircleIconContainer
              background={"madangGreen"}
              borderRadius={100}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Link href={"/"}>
                <Icon size={80} name={"Quiz"} />
              </Link>
            </CircleIconContainer>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading mb={24} tag={"h3"} fontSize={[20, 32]}>
                Video
              </Heading>
              <P fontSize={[14, 16]}>
                Build your confidence tackling unfamiliar topics by observing
                experienced teachers delivering the lesson, or use the videos to
                support your pupils with homework and revision.
              </P>
            </Flex>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={["row", "column"]}
            ph={[0, 12]}
            background={"powderBlue"}
          >
            <SpanLink id="exit-quiz"></SpanLink>
            <CircleIconContainer
              background={"madangGreen"}
              borderRadius={100}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Link href={"/"}>
                <Icon size={80} name={"Quiz"} />
              </Link>
            </CircleIconContainer>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading mb={24} tag={"h3"} fontSize={[16, 24]}>
                Exit Quiz
              </Heading>
              <P fontSize={[14, 16]}>
                Finish your lesson with our exit quizzes, designed to test your
                pupils’ knowledge recall and to support you to identify areas
                which require reteaching. Project them in your classroom, or
                print them off as worksheets to use in class or as homework.
              </P>
            </Flex>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            background={"grey7"}
            mb={80}
            alignItems={"center"}
            justifyContent={"center"}
            ph={[0, 12]}
          >
            <ButtonAsLink label={"Find teaching resources"} href={"/"} />
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 12, 12]}>
          <Heading
            textAlign="center"
            color={"black"}
            lineHeight={32}
            fontSize={[16, 24]}
            tag={"h3"}
            mb={80}
          >
            How to plan a lesson using our resources and adapt them for your
            classroom.
          </Heading>
          <Flex alignItems={"center"} flexDirection={"column"}>
            <Card
              alignItems={"center"}
              justifyContent={"center"}
              flexDirection={["column-reverse", "column"]}
              width={["100%", "50%"]}
              ph={[0, 12]}
            >
              <CircleIconContainer
                background={"madangGreen"}
                borderRadius={100}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Link href={"/"}>
                  <Icon size={80} name={"Quiz"} />
                </Link>
              </CircleIconContainer>
              <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
                <Heading
                  textAlign="center"
                  color={"black"}
                  fontSize={[24, 32]}
                  tag={"h3"}
                  mb={16}
                >
                  1. Find the right lesson
                </Heading>
                <P mb={32} fontSize={[14, 16]}>
                  Match your learning outcomes to an Oak lesson. Familiarise
                  yourself with the resources so you know where to start when
                  moulding them to your curriculum.
                </P>
              </Flex>
            </Card>
          </Flex>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            alignItems={"center"}
            flexDirection={["column-reverse", "column"]}
            ph={[0, 12]}
          >
            <RoundedImage src="/images/Image.png"></RoundedImage>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading
                textAlign="center"
                color={"black"}
                fontSize={[24, 32]}
                tag={"h3"}
                mb={16}
              >
                2. Personalise your explanation
              </Heading>
              <P mb={32} fontSize={[14, 16]}>
                Watch the video to inspire and refine your own explanation for
                your class, connecting the learning to your previous and next
                lessons.
              </P>
            </Flex>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={["column-reverse", "column"]}
            ph={[0, 12]}
          >
            <RoundedImage src="/images/Image.png"></RoundedImage>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading
                textAlign="center"
                color={"black"}
                fontSize={[24, 32]}
                tag={"h3"}
                mb={16}
              >
                3. Tailor the tasks for your class
              </Heading>
              <P mb={32} fontSize={[14, 16]}>
                Build in additional scaffolding, or remove included support to
                tailor the learning to the needs of your students. Decide how
                your class will complete each task and consider how you’ll
                divide your available time between tasks, explanation, and
                quizzes.
              </P>
            </Flex>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 12, 12]}>
          <Flex
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={["column-reverse", "column"]}
          >
            <RoundedImage src="/images/Image.png"></RoundedImage>
            <Card ph={[0, 12]} width={["100%", "50%"]}>
              <Heading
                textAlign="center"
                color={"black"}
                fontSize={[24, 32]}
                tag={"h3"}
                mb={16}
              >
                4. Teach the lesson
              </Heading>
              <P mb={16} textAlign="center" fontSize={[14, 16]}>
                Enjoy it - and let us know how you get on!
              </P>
              <ButtonAsLink
                label={"Search our lessons"}
                href={"https://teachers.thenational.academy/"}
              ></ButtonAsLink>
            </Card>
          </Flex>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card>
            <Heading textAlign="center" mb={16} fontSize={24} tag={"h4"}>
              Plan for lesson cover
            </Heading>
            <P mb={16}>
              Whether you’re arranging cover for your class or standing in for a
              colleague, make sure pupils’ learning doesn’t fall behind, without
              adding to your workload. Select the lesson you need and you or
              your colleague can pick up from where the class left off when you
              return. Choose from our bank of classroom resources and use our
              recorded lesson videos to support teaching.
            </P>
            <ButtonAsLink
              label={"Search our lessons"}
              href={"https://teachers.thenational.academy/"}
            ></ButtonAsLink>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card color="grey8" justifyContent={"center"} alignItems={"center"}>
            Video
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 12, 12]}>
          <Card>
            <Heading
              textAlign="center"
              mb={16}
              color={"black"}
              fontSize={24}
              tag={"h4"}
            >
              Plan for absent pupils
            </Heading>
            <P mb={16}>
              Keep pupils who are temporarily learning from home on track by
              directing them to curriculum-aligned lessons in our pupil area.
              Simply copy the online lesson link into Google Classroom, MS teams
              or your school's learning management system (LMS). Our lesson
              videos give your pupils access to a teacher who explains and
              scaffolds their learning, just like you would in the classroom.
              And you can keep track of their progress with our quizzes, with
              their scores sent directly to you. Use the same resources to teach
              the lesson in class, so you only ever have to plan once. When
              setting homework or revision, rather than spending time creating
              activities from scratch, explore and share our lessons with your
              classes instead.
            </P>
            <ButtonAsLink
              label={"Search our lessons"}
              href={"https://teachers.thenational.academy/"}
            ></ButtonAsLink>
          </Card>
        </GridArea>
      </Grid>
    </Layout>
  );
};

export default PlanALesson;
