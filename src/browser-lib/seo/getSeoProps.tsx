import { DEFAULT_SEO_PROPS, SeoProps } from "../../browser-lib/seo/Seo";
import { Seo } from "../../common-lib/cms-types";
import getBrowserConfig from "../getBrowserConfig";

type GetSeoProps = Pick<SeoProps, "imageUrl">;

export const getSeoProps = (
  props: (Seo & GetSeoProps) | undefined | null,
  options: { addTitleSuffix?: boolean } = { addTitleSuffix: true },
): SeoProps => {
  if (!props) {
    return DEFAULT_SEO_PROPS;
  }

  const title =
    options.addTitleSuffix && props.title
      ? `${props.title} | ${getBrowserConfig("seoAppName")}`
      : props.title;

  return {
    title: title || DEFAULT_SEO_PROPS.title,
    description: props.description || DEFAULT_SEO_PROPS.description,
    canonicalURL: props.canonicalURL || undefined,
    imageUrl: props.imageUrl,
  };
};
