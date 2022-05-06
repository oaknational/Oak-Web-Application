import { FC } from "react";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import cardImage from "../../public/Image.png";
import graphqlApi from "../node-lib/graphql";
import Layout from "../components/Layout";
import { LessonId } from "../hooks/useBookmarks";
import Card from "../components/Card";
import CardText from "../components/Card/CardText";
import CardImage from "../components/Card/CardImage";
import CardContainer from "../components/Card/CardContainer";
import CardButton from "../components/Card/CardButton";
import CardImageButtonVariant from "../components/Card/CardImageButtonVariant";

const Home: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { lesson } = props;
  const { title } = lesson;

  return (
    <Layout>
      <h1 data-testid="lesson-title">{title}</h1>
      <div style={{ width: "308px" }}>
        <CardImageButtonVariant
          title={"Title"}
          text={"Short snappy description of what this card is about."}
          buttonHref={"/"}
          buttonLabel={"label"}
          imageUrl={cardImage}
        />
        <p>-----</p>
        <div>
          <CardContainer>
            <CardImage imageUrl={cardImage} />
            <Card radius={false}>
              <CardText>Title</CardText>
              <CardText variant={"body3"}>
                Short snappy description of what this card is about.
              </CardText>
              <CardButton href="/" label="Label" />
            </Card>
          </CardContainer>

          <p>-----</p>

          <Card>
            <CardText alignCenter icon="Star" iconPosition="aboveTitle">
              Title
            </CardText>
            <CardText alignCenter variant={"body3"}>
              Short snappy description of what this card is about.
            </CardText>
            <CardButton href="/" label="Label" />
          </Card>
          <p>---</p>
          <Card>
            <CardText icon="Download" iconPosition="before">
              Need some help?
            </CardText>
            <CardText variant={"body3"}>
              Preview, plan and customise each element of our lessons to meet
              your needs - whether inside and outside the classroom.
            </CardText>
            <CardButton href="/" label="Label" />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<{
  lesson: { id: LessonId; slug: string; title: string };
}> = async () => {
  const res = await graphqlApi.lessonsBySlug({
    slug: "physics-only-review-chj3cd",
  });
  const [lesson = null] = res.lessons;
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
