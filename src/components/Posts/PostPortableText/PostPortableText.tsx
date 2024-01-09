import {
  MissingComponentHandler,
  PortableTextComponents,
} from "@portabletext/react";
import { FC } from "react";

import PostBlockCallout from "./PostBlockCallout";
import PostCallout from "./PostCallout";
import PostCta from "./PostCta";
import PostForm from "./PostForm";
import PostImageWithAltText from "./PostImageWithAltText";
import PostQuote from "./PostQuote";
import PostSectionHeading from "./PostSectionHeading";
import PostTextAndMedia from "./PostTextAndMedia";
import PostVideo from "./PostVideo";
import {
  extractFootnotes,
  Footnote,
  PostFootnoteAnnotation,
  PostFootnotesSection,
} from "./PostFootnotes";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const logMissingPortableTextComponents: MissingComponentHandler = (
  message,
  options,
) => {
  console.log(message, {
    type: options.type,
    nodeType: options.nodeType,
  });
};

type PostPortableTextContext = {
  footnotes: Footnote[];
};

const postPortableTextComponents = ({
  footnotes,
}: PostPortableTextContext): PortableTextComponents => ({
  block: {
    sectionHeading: PostSectionHeading,
    callout: PostBlockCallout,
  },
  types: {
    imageWithAltText: PostImageWithAltText,
    video: PostVideo,
    textAndMedia: PostTextAndMedia,
    formWrapper: PostForm,
    quote: PostQuote,
    callout: PostCallout,
    cta: PostCta,
  },
  marks: {
    footnote: (props) => {
      return <PostFootnoteAnnotation {...props} footnotes={footnotes} />;
    },
  },
});

type PostPortableTextProps = {
  portableText: PortableTextJSON;
};

const PostPortableText: FC<PostPortableTextProps> = (props) => {
  const { portableText } = props;

  const footnotes = extractFootnotes(portableText);
  const portableTextComponents = postPortableTextComponents({ footnotes });

  return (
    <>
      <PortableTextWithDefaults
        components={portableTextComponents}
        value={portableText}
        onMissingComponent={logMissingPortableTextComponents}
      />
      <PostFootnotesSection footnotes={footnotes} />
    </>
  );
};

export default PostPortableText;
