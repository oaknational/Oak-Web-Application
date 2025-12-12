import { usePathname } from "next/navigation";

import { getPageViewProps } from "../browser-lib/analytics/getPageViewProps";

const useAnalyticsPageProps = () => {
  const pathName = usePathname();

  if (!pathName) throw new Error("Router not ready");

  const pageViewProps = getPageViewProps(pathName);

  return pageViewProps;
};

export default useAnalyticsPageProps;
