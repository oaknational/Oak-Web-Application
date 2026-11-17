/**
 * A custom renderer with an exported `seo` object for asserting
 * against. Wraps `renderWithProviders`
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import { RenderOptions } from "@testing-library/react";
import {
  isValidElement,
  ReactElement,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HeadManagerContext } from "next/dist/shared/lib/head-manager-context.shared-runtime";

import "../../browser-lib/oak-globals/oakGlobals";

import renderWithProviders, {
  ProviderPartialProps,
  allProviders,
} from "./renderWithProviders";

const getHeadSignature = (elements: ReactNode[]) =>
  JSON.stringify(
    elements.map((element) =>
      isValidElement(element)
        ? { type: element.type, key: element.key, props: element.props }
        : element,
    ),
  );

function TestHeadManager({ children }: { children: ReactNode }) {
  const mountedInstances = useRef(new Set());
  const [head, setHead] = useState<ReactNode[]>([]);
  const headManager = useMemo(
    () => ({
      mountedInstances: mountedInstances.current,
      updateHead: (nextHead: ReactNode[]) => {
        const nextSignature = getHeadSignature(nextHead);
        setHead((currentHead) =>
          getHeadSignature(currentHead) === nextSignature
            ? currentHead
            : nextHead,
        );
      },
    }),
    [],
  );

  return (
    <HeadManagerContext.Provider value={headManager}>
      {children}
      {typeof document === "undefined"
        ? null
        : createPortal(head, document.head)}
    </HeadManagerContext.Provider>
  );
}

const renderWithSeo =
  (providers: Partial<ProviderPartialProps> = allProviders) =>
  (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
    const renderResult = renderWithProviders(providers)(
      <TestHeadManager>{ui}</TestHeadManager>,
      options,
    );

    const getMetaProperty = (name: string) =>
      document.head
        .querySelector(`meta[property="${name}"]`)
        ?.getAttribute("content");

    const getMetaName = (name: string) =>
      document.head
        .querySelector(`meta[name="${name}"]`)
        ?.getAttribute("content");

    const seo = {
      title: document.head.querySelector("title")?.textContent,
      description: getMetaName("description"),
      ogTitle: getMetaProperty("og:title"),
      ogDescription: getMetaProperty("og:description"),
      ogUrl: getMetaProperty("og:url"),
      ogImage: getMetaProperty("og:image"),

      // These seem to be broken - they render correctly on-site but
      // return undefined in tests
      // ogImageAlt: getMetaProperty("og:image:alt"),
      // ogImageWidth: getMetaProperty("og:image:width"),
      // ogImageHeight: getMetaProperty("og:image:height"),

      ogSiteName: getMetaProperty("og:site_name"),
      canonical: document.head
        .querySelector(`link[rel=canonical]`)
        ?.getAttribute("href"),
      robots: getMetaName("robots"),
    };
    return { ...renderResult, seo };
  };

export default renderWithSeo;
