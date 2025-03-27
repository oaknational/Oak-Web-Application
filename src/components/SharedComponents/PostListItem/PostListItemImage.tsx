import { FC } from "react";

import CMSImage from "@/components/SharedComponents/CMSImage";
import { getSizes } from "@/components/SharedComponents/CMSImage/getSizes";
import OwaImage from "@/components/SharedComponents/OwaImage/OwaImage";

import { PostListItemProps } from ".";

/**
 * The image next to the blurb in a blog list item.
 *
 * ### Blog posts
 *
 * Renders main image for blog posts (using `<CMSImage />`)
 *
 * ### Webinars
 *
 * Renders the video thumbnail for webinars (using `<OakImage />`)
 */
const PostListItemImage: FC<PostListItemProps> = (props) => {
  switch (props.contentType) {
    case "blog-post":
      if (!props.mainImage) {
        return null;
      }
      return (
        <CMSImage
          fill
          style={{ objectFit: "cover", objectPosition: "center center" }}
          image={props.mainImage}
          sizes={getSizes(["100vw", 256])}
          // Explicitly set an empty string for missing alt text in thumbnails
          // pending a a11y decision on alt for thumbs
          alt={props.mainImage.altText || ""}
        />
      );

    case "webinar":
      if (!props.thumbnailUrl) {
        return null;
      }
      return (
        <OwaImage
          fill
          style={{ objectFit: "contain", objectPosition: "center center" }}
          $background="black"
          alt=""
          src={props.thumbnailUrl}
        />
      );
  }
};

export default PostListItemImage;
