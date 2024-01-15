import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

import ErrorView from "../components/AppComponents/ErrorView";

interface Props {
  statusCode?: number;
}

const ErrorPage: NextPage<Props> = ({ statusCode }) => {
  const router = useRouter();
  const onBackClick = () => router.back();
  return <ErrorView onBackClick={onBackClick} statusCode={statusCode} />;
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
