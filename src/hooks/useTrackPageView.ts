import { useEffect, useState } from "react";
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

  const [isTrackPageViewCalled, setIsTrackPageViewCalled] = useState(false);

  useEffect(() => {
    !isTrackPageViewCalled &&
      track.pageView({
        linkUrl: router.pathname,
        pageType: [pageTitle],
        useCase: avoUseCase,
      });

    setIsTrackPageViewCalled(true);
  }, [avoUseCase, track, pageTitle, router.pathname, isTrackPageViewCalled]);

  return;
};

export default useTrackPageView;
