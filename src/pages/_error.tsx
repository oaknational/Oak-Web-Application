import { NextPage, NextPageContext } from "next";

import Button from "../components/Button";
import Layout from "../components/Layout";

interface Props {
  statusCode?: number;
}

const ErrorPage: NextPage<Props> = ({ statusCode }) => {
  return (
    <Layout>
      {statusCode === 404 ? (
        <h1 data-testid="404Heading">Page not found</h1>
      ) : (
        <h1>Oops, something went wrong</h1>
      )}
      <p data-testid="errorStatus">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
      <p>Get back on track</p>
      <Button href="/" label={"Homepage"}>
        Homepage
      </Button>
    </Layout>
  );
};

export const getInitialProps = ({ res, err }: NextPageContext) => {
  let statusCode;
  if (res) {
    statusCode = res.statusCode;
  } else {
    statusCode = err ? err.statusCode : 404;
  }

  return { statusCode };
};

export default ErrorPage;
