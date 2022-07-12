import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";

import { CourseJsonLd } from "../../../browser-lib/seo/getJsonLd";
import Seo from "../../../browser-lib/seo/Seo";
import Breadcrumbs from "../../../components/Breadcrumbs";
import BrowserWidthBar from "../../../components/BrowserWidthBar";
import Flex from "../../../components/Flex";
import Layout from "../../../components/Layout/Layout";
import LessonHeader from "../../../components/LessonHeader/LessonHeader";
import { LessonId } from "../../../context/Bookmarks";
import graphqlApi from "../../../node-lib/graphql";

const Lesson: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { lesson } = props;

  return (
    <>
      <Seo
        title={`${lesson.title} lesson | Oak National Academy`}
        description={
          "This lesson revises the Forces subject knowledge of the GCSE Physics Science only, and gives an opportunity to work through some independent tasks and exam questions."
        }
      />
      <CourseJsonLd
        courseName={lesson.title}
        description={"lesson.description"}
        provider
      />
      <Layout
        seoProps={{
          title: `${lesson.title} lesson | Oak National Academy`,
          description:
            "This lesson revises the Forces subject knowledge of the GCSE Physics Science only, and gives an opportunity to work through some independent tasks and exam questions.",
        }}
        background="grey1"
      >
        <header>
          <Flex pv={40}>
            <Breadcrumbs
              breadcrumbs={[
                { href: "/", label: "[key-stage]" },
                { href: "/", label: "Subjects" },
                { href: "/", label: "[subject-name]" },
                { href: "/", label: "[unit-name]" },
              ]}
            />
          </Flex>
          <BrowserWidthBar pv={40} background="white">
            <LessonHeader {...lesson} />
          </BrowserWidthBar>
        </header>
      </Layout>
    </>
  );
};

export default Lesson;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await graphqlApi.allLessons();
  const paths = res.lessons.map((l) => ({ params: { lessonSlug: l.slug } }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<
  {
    lesson: { id: LessonId; slug: string; title: string };
  },
  { lessonSlug: string }
> = async ({ params }) => {
  if (!params || !params.lessonSlug) {
    throw new Error("No params which we thought were there");
  }

  const { lessonSlug } = params;

  const res = await graphqlApi.lessonsBySlug({ slug: lessonSlug });
  const [lesson] = res.lessons;

  if (!lesson) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      lesson,
    },
  };
};
