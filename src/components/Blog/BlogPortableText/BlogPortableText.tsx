import {
  MissingComponentHandler,
  PortableText,
  PortableTextComponents,
} from "@portabletext/react";
import { FC } from "react";

import { PortableTextJSON } from "../../../common-lib/cms-types";
import { BasePortableTextProvider } from "../../PortableText";

import BlogBlockCallout from "./BlogBlockCallout";
import BlogCallout from "./BlogCallout";
import BlogCta from "./BlogCta";
import BlogImageWithAltText from "./BlogImageWithAltText";
import BlogQuote from "./BlogQuote";
import BlogSectionHeading from "./BlogSectionHeading";
import BlogTextAndMedia from "./BlogTextAndMedia";
import BlogVideo from "./BlogVideo";

const logMissingPortableTextComponents: MissingComponentHandler = (
  message,
  options
) => {
  console.log(message, {
    type: options.type,
    nodeType: options.nodeType,
  });
};

const blogPortableTextComponents: PortableTextComponents = {
  block: {
    sectionHeading: BlogSectionHeading,
    callout: BlogBlockCallout,
  },
  types: {
    imageWithAltText: BlogImageWithAltText,
    video: BlogVideo,
    textAndMedia: BlogTextAndMedia,
    quote: BlogQuote,
    callout: BlogCallout,
    cta: BlogCta,
  },
};

type BlogPortableTextProps = {
  portableText: PortableTextJSON;
};

const BlogPortableText: FC<BlogPortableTextProps> = (props) => {
  const { portableText } = props;
  return (
    <BasePortableTextProvider>
      <PortableText
        components={blogPortableTextComponents}
        value={portableText}
        onMissingComponent={logMissingPortableTextComponents}
      />
    </BasePortableTextProvider>
  );
};

export default BlogPortableText;
