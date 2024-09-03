import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { HomePageProps } from "@/pages-helpers/home/getBlogPosts";
import AiPage, { getStaticProps as getStaticPropsAi } from "@/pages/ai/index";

const Home: NextPage<HomePageProps> = (props) => {
  const router = useRouter();

  useEffect(() => {
    // clientside redirect for old tabs implementation
    if (window.location.href.includes("#pupils")) {
      router.push("/pupils");
    } else if (window.location.href.includes("#curriculum")) {
      router.push("/curriculum");
    } else if (window.location.href.includes("#ai")) {
      //router.push("/ai");
      router.push("/");
    } else if (window.location.href.includes("#teachers")) {
      router.push("/teachers");
    }
  }, [router]);

  return <AiPage {...props} />;
};

export const getStaticProps: GetStaticProps<HomePageProps> = getStaticPropsAi;

export default Home;
