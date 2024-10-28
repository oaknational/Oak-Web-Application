import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { HomePageProps } from "@/pages-helpers/home/getBlogPosts";
import Home, {
  getStaticProps as getStaticPropsTeachers,
  TeachersHomePageProps,
} from "@/pages/teachers/index";

const HomePage: NextPage<TeachersHomePageProps> = (props) => {
  const router = useRouter();
  useEffect(() => {
    // clientside redirect for old tabs implementation
    if (window.location.href.includes("#pupils")) {
      router.push("/pupils");
    } else if (window.location.href.includes("#curriculum")) {
      router.push("/curriculum");
    } else if (window.location.href.includes("#ai")) {
      //router.push("/ai");
      router.push("/#ai");
    } else if (window.location.href.includes("#teachers")) {
      router.push("/teachers");
    }
  }, [router]);

  return <Home {...props} />;
};

export const getStaticProps: GetStaticProps<HomePageProps> =
  getStaticPropsTeachers;

export default HomePage;
