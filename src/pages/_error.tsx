import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

import ErrorView from "../components/AppComponents/ErrorView";

import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

export interface ErrorProps {
  statusCode?: number;
  topNav: TopNavProps;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode, topNav }) => {
  const router = useRouter();
  const onBackClick = () => router.back();
  return (
    <ErrorView
      onBackClick={onBackClick}
      statusCode={statusCode}
      topNav={topNav}
    />
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

export const defaultTopNavProps: TopNavProps = {
  teachers: null,
  pupils: null,
};

export default ErrorPage;
