import {
  MissingComponentHandler,
  PortableTextComponents,
} from "@portabletext/react";
import { FC } from "react";

import PostBlockCallout from "@/components/GenericPagesComponents/PostBlockCallout";
import PostCallout from "@/components/GenericPagesComponents/PostCallout";
import PostCta from "@/components/GenericPagesComponents/PostCta";
import PostForm from "@/components/GenericPagesComponents/PostForm";
import PostImageWithAltText from "@/components/GenericPagesComponents/PostImageWithAltText";
import PostQuote from "@/components/GenericPagesComponents/PostQuote";
import PostSectionHeading from "@/components/GenericPagesComponents/PostSectionHeading";
import PostTextAndMedia from "@/components/GenericPagesComponents/PostTextAndMedia";
import PostVideo from "@/components/GenericPagesComponents/PostVideo";
import {
  extractFootnotes,
  Footnote,
  PostFootnoteAnnotation,
  PostFootnotesSection,
} from "@/components/GenericPagesComponents/PostFootnotes";
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
