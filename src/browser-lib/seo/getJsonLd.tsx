import { FC } from "react";
import {
  CourseJsonLd as CourseJsonLdNextSeo,
  CourseJsonLdProps,
  BreadcrumbJsonLd as BreadcrumbsJsonLdNextSeo,
  BreadCrumbJsonLdProps,
  OrganizationJsonLd as OrganizationJsonLdNextSeo,
  ArticleJsonLd as ArticleJsonLdNextSeo,
  ArticleJsonLdProps,
  CarouselJsonLd,
} from "next-seo";

import { Breadcrumb } from "../../components/Breadcrumbs/Breadcrumbs";
import config from "../../config/browser";
import { SerializedBlogPostPreview } from "../../components/pages/BlogIndex.page";
import { SerializedWebinarPreview } from "../../components/pages/WebinarsIndex.page";
import { getVideoThumbnail } from "../../components/VideoPlayer/getVideoThumbnail";

const courseProvider = {
  name: config.get("appName"),
  url: config.get("appUrl"),
};

// Organization

export const OrganizationJsonLd = () => {
  return (
    <OrganizationJsonLdNextSeo
      name={config.get("appName")}
      url={config.get("appUrl")}
      sameAs={[config.get("appFacebook"), config.get("appTwitter")]}
      logo={`${config.get("appUrl")}${config.get("appLogo")}`}
    />
  );
};

// Course logo

interface CourseProps extends CourseJsonLdProps {
  provider: boolean;
}

export const CourseJsonLd: FC<CourseProps> = (props) => {
  return CourseJsonLdNextSeo({ ...props, provider: { ...courseProvider } });
};

// Breadcrumbs

interface BreadcrumbProps extends BreadCrumbJsonLdProps {
  itemListElements: Breadcrumb[];
}

export const BreadcrumbJsonLd: FC<BreadcrumbProps> = (props) => {
  const breadcrumbsForJsonLd = props.itemListElements.map((i, index) => ({
    position: index + 1,
    name: i.label,
    item: i.href,
  }));

  return BreadcrumbsJsonLdNextSeo({
    ...props,
    itemListElements: breadcrumbsForJsonLd,
  });
};

// Blogs

const blogObject = (blog: SerializedBlogPostPreview): ArticleJsonLdProps => {
  return {
    type: "Article",
    url: `${config.get("appUrl")}/blog/${blog.slug}`,
    title: blog.seo?.title || blog.title,
    images: [blog.mainImage.asset?.url || config.get("appLogo")],
    datePublished: blog.date,
    dateModified: blog.date,
    authorName: blog.author.name,
    description: blog.seo?.description || blog.summary,
  };
};

const webinarObject = (blog: SerializedWebinarPreview): ArticleJsonLdProps => {
  return {
    type: "Article",
    url: `${config.get("appUrl")}/beta/webinars/${blog.slug}`, // @todo remove beta on merge
    title: blog.seo?.title || blog.title,
    images: [
      getVideoThumbnail(
        blog.video.video.asset.playbackId,
        blog.video.video.asset.thumbTime
      ) || config.get("appLogo"),
    ],
    datePublished: blog.date,
    dateModified: blog.date,
    authorName: blog.hosts ? blog.hosts[0]?.name : "",
    description: blog.seo?.description || blog.title,
  };
};

type BlogListJsonLdProps = {
  blogs: SerializedBlogPostPreview[] | SerializedWebinarPreview[];
};

export const BlogListJsonLd: FC<BlogListJsonLdProps> = ({ blogs }) => {
  const blogListForJsonLd = blogs.map((blog, index) => {
    const blogObjects =
      "video" in blog ? webinarObject(blog) : blogObject(blog);
    return {
      position: index + 1,
      courseName: blog.title,
      ...blogObjects,
    };
  });

  return CarouselJsonLd({
    ofType: "course",
    data: blogListForJsonLd,
    provider: { ...courseProvider },
  });
};

type BlogJsonLdProps = {
  blog: SerializedBlogPostPreview | SerializedWebinarPreview;
};

export const BlogJsonLd: FC<BlogJsonLdProps> = ({ blog }) => {
  return "video" in blog
    ? ArticleJsonLdNextSeo({
        isAccessibleForFree: true,
        ...webinarObject(blog),
      })
    : ArticleJsonLdNextSeo({ isAccessibleForFree: true, ...blogObject(blog) });
};
