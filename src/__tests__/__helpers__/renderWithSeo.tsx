/**
 * A custom renderer with an exported `seo` object for asserting
 * against. Wraps `renderWithProviders`
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import { ReactElement } from "react";
import { RenderOptions } from "@testing-library/react";

import "../../browser-lib/oak-globals/oakGlobals";

import renderWithProviders, { ProviderProps } from "./renderWithProviders";

const renderWithSeo = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
  providerProps?: ProviderProps
) => {
  const renderResult = renderWithProviders(ui, options, providerProps);

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
    ogImageAlt: getMetaProperty("og:image:alt"),
    ogImageWidth: getMetaProperty("og:image:width"),
    ogImageHeight: getMetaProperty("og:image:height"),
    ogSiteName: getMetaProperty("og:site_name"),
    canonical: renderResult.container
      .querySelector(`link[rel=canonical]`)
      ?.getAttribute("href"),
  };
  return { ...renderResult, seo };
};

export default renderWithSeo;
