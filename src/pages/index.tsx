import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Teachers, {
  getStaticProps as getStaticPropsTeachers,
  TeachersHomePageProps,
} from "@/pages/teachers";

const Home: NextPage<TeachersHomePageProps> = (props) => {
  const router = useRouter();

  useEffect(() => {
    // clientside redirect for old tabs implementation
    if (window.location.href.includes("#pupils")) {
      router.push("/pupils");
    } else if (window.location.href.includes("#curriculum")) {
      router.push("/curriculum");
    } else if (window.location.href.includes("#ai")) {
      router.push("/ai");
    }
  }, [router]);

  return <Teachers {...props} />;
};
export const getStaticProps = getStaticPropsTeachers;

export default Home;
