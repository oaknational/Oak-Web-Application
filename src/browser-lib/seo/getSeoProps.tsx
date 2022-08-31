import { DEFAULT_SEO_PROPS, SeoProps } from "../../browser-lib/seo/Seo";
import { Seo } from "../../node-lib/cms";

export const getSeoProps = (props: Seo | undefined | null): SeoProps => {
  if (props == null) {
    return DEFAULT_SEO_PROPS;
  }
  return {
    title: props.title || DEFAULT_SEO_PROPS.title,
    description: props.description || DEFAULT_SEO_PROPS.title,
    canonicalURL: props.canonicalURL || undefined,
  };
};
