import { FC } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import api from "../data-layer/graphql/api";
import Layout from "../components/Layout";
import { useLessonsBySlugQuery } from "../data-layer/graphql/generated/apollo";

const Home: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const { loading, data } = useLessonsBySlugQuery({
    variables: { slug: "physics-only-review-chj3cd" },
  });

  const title = data?.lesson[0]?.title;

  return (
    <Layout>
      <h1 data-test-id="lesson-title">{title}</h1>
      <p>Status: {loading ? "loading" : "idle"}</p>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await api.lessonsBySlug({ slug: "physics-only-review-chj3cd" });
  const [lesson = null] = res.lesson;
  return {
    props: {
      lesson,
    },
  };
};
