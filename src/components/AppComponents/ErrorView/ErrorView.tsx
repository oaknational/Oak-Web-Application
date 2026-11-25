import { FC } from "react";

import { TopNavProps } from "../TopNav/TopNav";

import { DEFAULT_SEO_PROPS } from "@/browser-lib/seo/Seo";
import AppLayout from "@/components/AppComponents/AppLayout";
import NotFoundPane from "@/components/GenericPagesComponents/NotFoundPane";

type ErrorViewProps = {
  onBackClick?: () => void;
  statusCode?: number;
  topNav: TopNavProps;
};
const ErrorView: FC<ErrorViewProps> = (props) => {
  const { onBackClick, statusCode, topNav } = props;
  return (
    <AppLayout
      seoProps={DEFAULT_SEO_PROPS}
      appVariant={"client-error"}
      topNavProps={topNav}
    >
      <NotFoundPane statusCode={statusCode} onBackClick={onBackClick} />
    </AppLayout>
  );
};

export default ErrorView;
