import { DEFAULT_SEO_PROPS, SeoProps } from "../../browser-lib/seo/Seo";
import { Seo } from "../../node-lib/cms";

type GetSeoProps =
  | (Pick<SeoProps, "imageUrl" | "imageAlt"> & Seo)
  | undefined
  | null;

export const getSeoProps = (
  props: GetSeoProps,
  options: { addTitleSuffix?: boolean } = { addTitleSuffix: true }
): SeoProps => {
  if (props == null) {
    return DEFAULT_SEO_PROPS;
  }

  const title =
    options.addTitleSuffix && props.title
      ? `${props.title} | Oak National Academy`
      : props.title;

  return {
    title: title || DEFAULT_SEO_PROPS.title,
    description: props.description || DEFAULT_SEO_PROPS.description,
    canonicalURL: props.canonicalURL || undefined,
    imageUrl: props.imageUrl,
    imageAlt: props.imageAlt,
  };
};
