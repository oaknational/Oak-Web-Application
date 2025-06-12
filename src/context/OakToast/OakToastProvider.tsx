import { OakFlex, OakToast, OakToastProps } from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { createContext, FC, useEffect, useState } from "react";
import styled from "styled-components";

type OakToastContext = {
  currentToastProps: OakToastProps | null;
  setCurrentToastProps: (props: OakToastProps | null) => void;
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
  const [offsetTop, setOffsetTop] = useState<number>(82);
  const [id, setId] = useState(0);
  const { asPath } = useRouter();

  useEffect(() => {
    // Adjust the distance from the top of the screen when the header is visible
    const observer = new IntersectionObserver(
      (entries) => {
        const headerIsVisible = entries[0]?.isIntersecting;
        if (headerIsVisible) {
          setOffsetTop(82);
        } else {
          setOffsetTop(32);
        }
      },
      // Only when the header is 50% visible, is it considered to be intersecting
      { threshold: 0.5 },
    );

    // Wait for the header to be rendered before observing it
    const timeOut = setTimeout(() => {
      const headerElement = document.querySelector("header");
      if (headerElement) {
        observer.observe(headerElement);
      }
    }, 100);

    return () => {
      clearTimeout(timeOut);
    };
  }, [asPath]);

  const setToastPropsAndId = (props: OakToastProps | null) => {
    setId((prevId) => prevId + 1);
    setCurrentToastProps(props);
  };

  return (
    <oakToastContext.Provider
      value={{ currentToastProps, setCurrentToastProps: setToastPropsAndId }}
    >
      <StyledOakToastContainer
        $position="fixed"
        $zIndex="in-front"
        offsetTop={offsetTop}
        $right={["all-spacing-0", "all-spacing-14"]}
        $width={["100%", "max-content"]}
        $justifyContent={["center", "flex-end"]}
        aria-live="polite"
      >
        {currentToastProps && (
          <OakToast
            {...currentToastProps}
            onClose={() => setCurrentToastProps(null)}
            id={id}
          />
        )}
      </StyledOakToastContainer>
      {children}
    </oakToastContext.Provider>
  );
};
