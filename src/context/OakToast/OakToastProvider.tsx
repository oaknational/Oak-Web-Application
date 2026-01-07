import {
  oakDefaultTheme,
  OakFlex,
  OakInlineBanner,
  OakInlineBannerProps,
  OakThemeProvider,
  OakToast,
  OakToastProps,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { createContext, FC, useEffect, useState } from "react";
import styled from "styled-components";

type OakToastContext = {
  currentToastProps: OakToastProps | null;
  setCurrentToastProps: (props: OakToastProps | null) => void;
  currentBannerProps: OakInlineBannerProps | null;
  setCurrentBannerProps: (props: OakInlineBannerProps | null) => void;
};

export const oakToastContext = createContext<OakToastContext | null>(null);

const StyledOakToastContainer = styled(OakFlex)<{ offsetTop: number }>`
  top: ${(props) => props.offsetTop}px;
`;

export const OakToastProvider: FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [currentToastProps, setCurrentToastProps] =
    useState<OakToastProps | null>(null);
  const [currentBannerProps, setCurrentBannerProps] =
    useState<OakInlineBannerProps | null>(null);

  const [offsetTop, setOffsetTop] = useState<number>(82);
  const [id, setId] = useState(0);
  const { asPath } = useRouter();

  const newTopNavEnabled = useFeatureFlagEnabled("teachers-new-top-nav");

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let timeOut: NodeJS.Timeout;

    // Create an IntersectionObserver to detect when the header is visible
    const createObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          const headerIsVisible = entries[0]?.isIntersecting;
          const visibleOffset = newTopNavEnabled ? 152 : 82;
          setOffsetTop(headerIsVisible ? visibleOffset : 32);
        },
        // Header will only be considered to be intersecting when at least 50% of it is visible
        { threshold: 0.5 },
      );

      // Short timeout to ensure the header is rendered before observing
      // 100ms is not enough for authenticated routes
      // todo: look into using a mutation observer instead
      timeOut = setTimeout(() => {
        const headerElement = document.querySelector("header");
        if (headerElement && observer) {
          observer.observe(headerElement);
        }
      }, 500);
    };

    createObserver();

    return () => {
      // Cleanup the observer and timeout
      // This ensures that a stale state from a previous route does not persist
      clearTimeout(timeOut);
      observer?.disconnect();
    };
  }, [asPath, newTopNavEnabled]);

  const setToastPropsAndId = (props: OakToastProps | null) => {
    setId((prevId) => prevId + 1);
    setCurrentToastProps(props);
  };

  return (
    <oakToastContext.Provider
      value={{
        currentToastProps,
        setCurrentToastProps: setToastPropsAndId,
        currentBannerProps,
        setCurrentBannerProps,
      }}
    >
      <OakThemeProvider theme={oakDefaultTheme}>
        <StyledOakToastContainer
          $position="fixed"
          $zIndex="in-front"
          offsetTop={offsetTop}
          $right={["spacing-0", "spacing-24"]}
          $width={["100%", "max-content"]}
          aria-live="polite"
          $flexDirection={"column"}
          $gap={"spacing-12"}
          $alignItems={["center", "flex-end"]}
          $ph={["spacing-12", "spacing-0"]}
        >
          {currentBannerProps && (
            <OakInlineBanner
              {...currentBannerProps}
              $maxWidth={"spacing-480"}
              onDismiss={() => setCurrentBannerProps(null)}
              canDismiss
            />
          )}
          {currentToastProps && (
            <OakToast
              {...currentToastProps}
              onClose={() => setCurrentToastProps(null)}
              id={id}
            />
          )}
        </StyledOakToastContainer>
      </OakThemeProvider>
      {children}
    </oakToastContext.Provider>
  );
};
