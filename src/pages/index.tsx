import { FC } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import graphqlApi from "../node-lib/graphql";
import Layout from "../components/Layout";

const Home: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { lesson } = props;
  const { title } = lesson;

  return (
    <Layout>
      <h1 data-testid="lesson-title">{title}</h1>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<{
  lesson: { id: number; slug: string; title: string };
}> = async () => {
  const res = await graphqlApi.lessonsBySlug({
    slug: "physics-only-review-chj3cd",
  });
  const [lesson = null] = res.lesson;
  if (!lesson) {
    // @TODO not found
    throw new Error("404");
  }
  return {
    props: {
      lesson,
    },
  };
};
