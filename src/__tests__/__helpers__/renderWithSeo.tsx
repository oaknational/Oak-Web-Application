/**
 * A custom renderer with an exported `seo` object for asserting
 * against. Wraps `renderWithProviders`
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import { RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

import "../../browser-lib/oak-globals/oakGlobals";

import renderWithProviders, {
  ProviderPartialProps,
} from "./renderWithProviders";

const renderWithSeo =
  (providers?: Partial<ProviderPartialProps>) =>
  (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
    const renderResult = renderWithProviders(providers)(ui, options);

    const getMetaProperty = (name: string) =>
      renderResult.container
        .querySelector(`meta[property="${name}"]`)
        ?.getAttribute("content");

    const getMetaName = (name: string) =>
      renderResult.container
        .querySelector(`meta[name="${name}"]`)
        ?.getAttribute("content");

    const seo = {
      title: renderResult.container.querySelector("title")?.textContent,
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
      canonical: renderResult.container
        .querySelector(`link[rel=canonical]`)
        ?.getAttribute("href"),
      robots: getMetaName("robots"),
    };
    return { ...renderResult, seo };
  };

export default renderWithSeo;
