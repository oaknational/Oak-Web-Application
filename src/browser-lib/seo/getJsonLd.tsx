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
import { resolveOakHref } from "../../common-lib/urls";

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

const blogToArticle = (blog: SerializedBlogPostPreview): ArticleJsonLdProps => {
  return {
    type: "Article",
    url: `${config.get("appUrl")}${resolveOakHref({
      page: "blog",
      slug: blog.slug,
    })}`,
    title: blog.seo?.title || blog.title,
    images: [blog.mainImage.asset?.url || config.get("appLogo")],
    datePublished: blog.date,
    dateModified: blog.date,
    authorName: blog.author.name,
    description: blog.seo?.description || blog.summary,
  };
};

const webinarToArticle = (
  webinar: SerializedWebinarPreview
): ArticleJsonLdProps => {
  return {
    type: "Article",
    url: `${config.get("appUrl")}${resolveOakHref({
      page: "webinars",
      slug: webinar.slug,
    })}`,
    title: webinar.seo?.title || webinar.title,
    images: [
      getVideoThumbnail(
        webinar.video.video.asset.playbackId,
        webinar.video.video.asset.thumbTime
      ) || config.get("appLogo"),
    ],
    datePublished: webinar.date,
    dateModified: webinar.date,
    authorName: webinar.hosts ? webinar.hosts[0]?.name : "",
    description: webinar.seo?.description || webinar.title,
  };
};

type BlogListJsonLdProps = {
  blogs: SerializedBlogPostPreview[] | SerializedWebinarPreview[];
};

export const BlogListJsonLd: FC<BlogListJsonLdProps> = ({ blogs }) => {
  const blogListForJsonLd = blogs.map((blog, index) => {
    const blogObjects =
      "video" in blog ? webinarToArticle(blog) : blogToArticle(blog);
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
        ...webinarToArticle(blog),
      })
    : ArticleJsonLdNextSeo({
        isAccessibleForFree: true,
        ...blogToArticle(blog),
      });
};
