import {
  MissingComponentHandler,
  PortableText,
  PortableTextComponents,
} from "@portabletext/react";
import { FC } from "react";

import { PortableTextJSON } from "../../../common-lib/cms-types";
import { BasePortableTextProvider } from "../../PortableText";

import PostBlockCallout from "./PostBlockCallout";
import PostCallout from "./PostCallout";
import PostCta from "./PostCta";
import PostImageWithAltText from "./PostImageWithAltText";
import PostQuote from "./PostQuote";
import PostSectionHeading from "./PostSectionHeading";
import PostTextAndMedia from "./PostTextAndMedia";
import PostVideo from "./PostVideo";

const logMissingPortableTextComponents: MissingComponentHandler = (
  message,
  options
) => {
  console.log(message, {
    type: options.type,
    nodeType: options.nodeType,
  });
};

const postPortableTextComponents: PortableTextComponents = {
  block: {
    sectionHeading: PostSectionHeading,
    callout: PostBlockCallout,
  },
  types: {
    imageWithAltText: PostImageWithAltText,
    video: PostVideo,
    textAndMedia: PostTextAndMedia,
    quote: PostQuote,
    callout: PostCallout,
    cta: PostCta,
  },
};

type PostPortableTextProps = {
  portableText: PortableTextJSON;
};

const PostPortableText: FC<PostPortableTextProps> = (props) => {
  const { portableText } = props;

  return (
    <BasePortableTextProvider>
      <PortableText
        components={postPortableTextComponents}
        value={portableText}
        onMissingComponent={logMissingPortableTextComponents}
      />
    </BasePortableTextProvider>
  );
};

export default PostPortableText;
