import { NextPage } from "next";

const TeachersHomePage: NextPage = () => {
  return <div />;
};

export const getStaticProps = async () => {
  return {
    redirect: {
      destination: "/",
      statusCode: 301,
    },
  };
};

export default TeachersHomePage;
