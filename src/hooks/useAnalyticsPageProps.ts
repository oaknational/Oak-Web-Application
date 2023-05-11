import { useRouter } from "next/router";

import { getPageViewProps } from "../browser-lib/analytics/getPageViewProps";

const useAnalyticsPageProps = () => {
  const router = useRouter();

  const pageViewProps = getPageViewProps(router.asPath);

  return pageViewProps;
};

export default useAnalyticsPageProps;
