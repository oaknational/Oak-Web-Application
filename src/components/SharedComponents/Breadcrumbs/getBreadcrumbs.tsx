import {
  OakBreadcrumb,
  OakBreadcrumbWithoutHref,
} from "@oaknational/oak-components";

import { BlogWebinarCategory } from "../../../common-lib/cms-types";
import { SerializedWebinar } from "../../../pages/webinars/[webinarSlug]";
import { SerializedBlog } from "../../../pages/blog/[blogSlug]";

/*
 *
 * getBlogBreadcrumbs()
 *
 * takes a list of blog categories and the slug of the selected category
 * returns an array of breadcrumbs - blog > [category]
 *
 */

export type CrumbPageVariant = "blog" | "webinars";

export const getBlogWebinarListBreadcrumbs = (
  categories: BlogWebinarCategory[],
  currentCategorySlug: string | null,
  page: CrumbPageVariant,
  text: string,
): [...OakBreadcrumb[], OakBreadcrumbWithoutHref] => [
  { text, href: `/${page}` },
  {
    text:
      categories.find((cat) => cat.slug === currentCategorySlug)?.title ||
      "All",
  },
];

export const getBlogWebinarPostBreadcrumbs = (
  categories: BlogWebinarCategory[],
  blog: SerializedBlog | SerializedWebinar,
  page: CrumbPageVariant,
  text: string,
): [...OakBreadcrumb[], OakBreadcrumbWithoutHref] => {
  const { title, category } = blog;
  return [
    { text, href: `/${page}` },
    {
      text:
        categories.find((cat) => cat.slug === category.slug)?.title || "All",
      href: `/${page}/categories/${category.slug}`,
    },
    {
      text: title,
    },
  ];
};
