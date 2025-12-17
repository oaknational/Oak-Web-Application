import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

import ErrorView from "../components/AppComponents/ErrorView";

import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";

interface Props {
  statusCode?: number;
}

const ErrorPage: NextPage<Props> = ({ statusCode }) => {
  const router = useRouter();
  const onBackClick = () => router.back();
  return (
    <ErrorView
      onBackClick={onBackClick}
      statusCode={statusCode}
      topNav={defaultTopNavProps}
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

// TD: [integrated journey] error page nav props
export const defaultTopNavProps: TopNavProps = {
  teachers: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", keystages: [] },
    secondary: {
      phaseSlug: "secondary",
      phaseTitle: "Secondary",
      keystages: [],
    },
    aboutUs: [],
    guidance: [],
  },
  pupils: {
    primary: { phaseSlug: "primary", phaseTitle: "Primary", years: [] },
    secondary: { phaseSlug: "secondary", phaseTitle: "Secondary", years: [] },
  },
};

export default ErrorPage;
