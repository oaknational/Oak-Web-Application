import { FC } from "react";
import styled from "styled-components";

import { DEFAULT_SEO_PROPS } from "../browser-lib/seo/Seo";
import Card from "../components/Card";
import Flex from "../components/Flex";
import Grid, { GridArea } from "../components/Grid";
import Layout from "../components/Layout";
import { Heading, P } from "../components/Typography";
import ButtonAsLink from "../components/Button/ButtonAsLink";
import { getBreakpoint } from "../styles/utils/responsive";
import IconButtonAsLink from "../components/Button/IconButtonAsLink";

const SpanLink = styled.span`
  scroll-margin-top: ${({ theme }) => theme.header.height + 12}px;

  @media (max-width: ${getBreakpoint("small")}px) {
    scroll-margin-top: ${({ theme }) => theme.header.height + 92}px;
  }
`;
const RoundedImage = styled.img`
  width: 136px;
  height: 136px;
  border-radius: 5px;

  @media (max-width: ${getBreakpoint("small")}px) {
    width: 80px;
    height: 80px;
  }
`;

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
              Plan a Lesson
            </Heading>
            <Heading
              mb={16}
              color={"black"}
              fontSize={[24, 32, 32]}
              lineHeight={40}
              tag={"h1"}
            >
              Save time planning your lessons with free, adaptable teacher-made
              resources
            </Heading>
            <P color={"black"} fontSize={16}>
              Our lessons and resources are designed to give teachers all the
              tools they need to plan their lessons. Find out more about Oak’s
              lesson planning resources and how you can adapt them for your
              class and school here.
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
            <Flex pa={12} color={""} justifyContent={"center"}>
              <Card alignItems={"center"} justifyContent={"center"} pa={0}>
                <IconButtonAsLink
                  size={"large"}
                  aria-label={""}
                  icon={"ChevronRight"}
                  href={"#intro-quiz"}
                ></IconButtonAsLink>

                <P textAlign="center">Intro Quiz</P>
              </Card>
              <Card alignItems={"center"} justifyContent={"center"} pa={0}>
                <IconButtonAsLink
                  size="large"
                  aria-label={""}
                  icon={"ChevronRight"}
                  href={"#lesson-slides"}
                ></IconButtonAsLink>
                <P textAlign="center">Lesson Slides</P>
              </Card>
              <Card alignItems={"center"} justifyContent={"center"} pa={0}>
                <IconButtonAsLink
                  size="large"
                  aria-label={""}
                  icon={"ChevronRight"}
                  href={"#video"}
                ></IconButtonAsLink>
                <P textAlign="center">Video</P>
              </Card>
              <Card alignItems={"center"} justifyContent={"center"} pa={0}>
                <IconButtonAsLink
                  size="large"
                  aria-label={""}
                  icon={"ChevronRight"}
                  href={"#worksheets"}
                ></IconButtonAsLink>
                <P textAlign="center">Worksheets</P>
              </Card>
              <Card alignItems={"center"} justifyContent={"center"} pa={0}>
                <IconButtonAsLink
                  size="large"
                  aria-label={""}
                  icon={"ChevronRight"}
                  href={"#exit-quiz"}
                ></IconButtonAsLink>
                <P textAlign="center">Exit quiz</P>
              </Card>
            </Flex>
          </Flex>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            alignItems={"center"}
            flexDirection={["row", "column"]}
            ph={[0, 12]}
          >
            <SpanLink id="intro-quiz"></SpanLink>
            <RoundedImage src="/images/Image.png"></RoundedImage>

            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading mb={24} tag={"h3"} fontSize={[20, 32]}>
                Intro Quiz
              </Heading>
              <P fontSize={[14, 16]}>
                Help your pupils retrieve or activate prior knowledge with our
                intro quizzes. Project them in your classroom, or print them off
                as worksheets to use in class or as homework.
              </P>
            </Flex>
          </Card>
        </GridArea>
        <GridArea colSpan={[12, 6, 6]}>
          <Card
            alignItems={"center"}
            flexDirection={["row", "column"]}
            ph={[0, 12]}
          >
            <SpanLink id="lesson-slides"></SpanLink>
            <RoundedImage src="/images/Image.png"></RoundedImage>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading mb={24} tag={"h3"} fontSize={[20, 32]}>
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
          >
            <SpanLink id="worksheets"></SpanLink>
            <RoundedImage src="/images/Image.png"></RoundedImage>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading mb={24} tag={"h3"} fontSize={[20, 32]}>
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
          >
            <SpanLink id="video"></SpanLink>
            <RoundedImage src="/images/Image.png"></RoundedImage>
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
          >
            <SpanLink id="exit-quiz"></SpanLink>
            <RoundedImage src="/images/Image.png"></RoundedImage>
            <Flex ml={[24, 0, 0]} mt={[0, 24, 24]} flexDirection={"column"}>
              <Heading mb={24} tag={"h3"} fontSize={[20, 32]}>
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
              <RoundedImage src="/images/Image.png"></RoundedImage>
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
