import AppLayout from "@/components/SharedComponents/AppLayout";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { getBlogPosts } from "@/pages-helpers/home/getBlogPosts";
import Banners from "@/components/CurriculumComponents/Banners";
import HomePageTabImageNav from "@/components/GenericPagesComponents/HomePageTabImageNav";
import TeachersTab from "@/components/GenericPagesComponents/TeachersTab";

async function Homepage() {
  const { pageData, posts } = await getBlogPosts(true, 5);

  if (!pageData) {
    return {
      notFound: true,
    };
  }

  const staticCurriculumData = await curriculumApi2023.teachersHomePage();

  const results = {
    props: {
      pageData,
      staticCurriculumData,
      posts,
    },
  };

  return (
    <AppLayout seoProps={{ title: "", description: "" }}>
      <Banners />
      <HomePageTabImageNav current={"teachers"} />
      <TeachersTab
        keyStages={results.props.staticCurriculumData.keyStages}
        aria-current="page"
      />
    </AppLayout>
  );
}

export default Homepage;
