import { FC } from "react";

import Layout, { LayoutProps } from "@/components/AppComponents/Layout";

export type AppLayoutProps = LayoutProps;
const AppLayout: FC<AppLayoutProps> = (props) => {
  const { children, ...layoutProps } = props;

  return (
    <Layout headerVariant="app" {...layoutProps}>
      {children}
    </Layout>
  );
};

export default AppLayout;
