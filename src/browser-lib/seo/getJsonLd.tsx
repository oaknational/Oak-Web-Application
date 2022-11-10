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
import { SerializedBlog } from "../../pages/blog/[blogSlug]";
import { SerializedBlogPostPreview } from "../../components/pages/BlogIndex.page";

const courseProvider = {
  name: config.get("seoAppName"),
  url: config.get("seoAppUrl"),
};

// Organization

export const OrganizationJsonLd = () => {
  return (
    <OrganizationJsonLdNextSeo
      name={config.get("seoAppName")}
      url={config.get("seoAppUrl")}
      sameAs={[config.get("seoAppFacebook"), config.get("seoAppTwitter")]}
      logo={`${config.get("seoAppUrl")}${config.get("seoAppLogo")}`}
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
    url: `${config.get("seoAppUrl")}/blog/${blog.slug}`,
    title: blog.title,
    images: [blog.mainImage.asset?.url || config.get("seoAppLogo")],
    datePublished: blog.date,
    dateModified: blog.date,
    authorName: blog.author.name,
    description: blog.summary,
  };
};

type BlogListJsonLdProps = {
  blogs: SerializedBlogPostPreview[];
};

export const BlogListJsonLd: FC<BlogListJsonLdProps> = ({ blogs }) => {
  const blogListForJsonLd = blogs.map((blog, index) => ({
    position: index + 1,
    courseName: blog.title,
    ...blogObject(blog),
  }));

  return CarouselJsonLd({
    ofType: "course",
    data: blogListForJsonLd,

    provider: { ...courseProvider },
  });
};

export const BlogJsonLd: FC<SerializedBlog> = (props) => {
  return ArticleJsonLdNextSeo(blogObject(props));
};
