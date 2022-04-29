import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";

import BookmarkLessonButton from "../../components/BookmarkLessonButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import Button, { ButtonProps } from "../../components/Button";
import Card from "../../components/Card";
import Layout from "../../components/Layout/Layout";
import { LessonId } from "../../hooks/useBookmarks";
import graphqlApi from "../../node-lib/graphql";

import styles from "./[lessonSlug].module.css";

const Lesson: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { lesson } = props;

  const buttons: Omit<ButtonProps, "background">[] = [
    { href: "/", label: "Unit Quiz" },
    { href: "/", label: "View In Classroom", icon: "OpenExternal" },
    { href: "/", label: "Foundation Curriculum (PDF)", icon: "Download" },
    { href: "/", label: "Higher Curriculum (PDF)", icon: "Download" },
  ];

  return (
    <Layout>
      <Breadcrumbs
        breadcrumbs={[
          { href: "/", label: "[key-stage]" },
          { href: "/", label: "Subjects" },
          { href: "/", label: "[subject-name]" },
          { href: "/", label: "[unit-name]" },
        ]}
      />
      <div className={styles["primary-buttons"]}>
        <BookmarkLessonButton lessonId={lesson.id} />
        <Button
          background="teachers-primary"
          href="/"
          label="Download"
          icon="Download"
        />
        <Button
          background="teachers-primary"
          href="/"
          label="Share Lesson"
          icon="Share"
        />
      </div>
      <h1 className={styles["title"]}>
        <span className={styles["lesson-overview-text"]}>Lesson overview:</span>
        <br />
        {lesson.title}
      </h1>
      <div className={styles["secondary-buttons"]}>
        {buttons.map((buttonProps) => {
          return (
            <Button
              key={buttonProps.label}
              variant="text-link"
              {...buttonProps}
            />
          );
        })}
      </div>
      <Card>Lesson content</Card>
    </Layout>
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
    // @TODO consistently figure a way to handle 404s etc
    throw new Error("404 Not found");
  }

  return {
    props: {
      lesson,
    },
  };
};
