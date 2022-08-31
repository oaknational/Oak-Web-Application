import { DEFAULT_SEO_PROPS, SeoProps } from "../../browser-lib/seo/Seo";
import { Seo } from "../../node-lib/cms";

export const getSeoProps = (props: Seo): SeoProps => {
  return {
    title: props.title || DEFAULT_SEO_PROPS.title,
    description: props.description || DEFAULT_SEO_PROPS.title,
    canonicalURL: props.canonicalURL || undefined,
  };
};
