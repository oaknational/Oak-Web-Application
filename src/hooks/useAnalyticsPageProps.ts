import { useRouter } from "next/compat/router";

import { getPageViewProps } from "../browser-lib/analytics/getPageViewProps";

const useAnalyticsPageProps = () => {
  const router = useRouter();

  const pageViewProps = router
    ? getPageViewProps(router.asPath)
    : { pageName: "Lesson", analyticsUseCase: "TEACHER" };

  return pageViewProps;
};

export default useAnalyticsPageProps;
