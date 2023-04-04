import { useEffect } from "react";
import { useRouter } from "next/router";

import useAnalytics from "../context/Analytics/useAnalytics";
import useAvoUseCase from "../hooks/useAvoUseCase";
import type { PageTypeValueType } from "../browser-lib/avo/Avo";

type UseTrackPageViewProps = {
  pageTitle: PageTypeValueType;
};

const useTrackPageView = ({ pageTitle }: UseTrackPageViewProps) => {
  const { track } = useAnalytics();
  const router = useRouter();
  const avoUseCase = useAvoUseCase();

  useEffect(() => {
    return () =>
      track.pageView({
        linkUrl: router.pathname,
        pageType: [pageTitle],
        useCase: avoUseCase,
      });
  }, [avoUseCase, track, pageTitle, router.pathname]);

  return;
};

export default useTrackPageView;
