import { NextPage } from "next";

const TeachersHomePage: NextPage = () => {
  return <div />;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/",
      statusCode: 301,
    },
  };
};

export default TeachersHomePage;
