import { BlogWebinarCategory } from "../../common-lib/cms-types";
import { SerializedBlog } from "../../pages/blog/[blogSlug]";
import { Breadcrumb } from "../Breadcrumbs";

/*
 *
 * getBlogBreadcrumbs()
 *
 * takes a list of blog categories and the slug of the selected category
 * returns an array of breadcrumbs - blog > [category]
 *
 */

export const getBlogBreadcrumbs = (
  categories: BlogWebinarCategory[],
  currentCategorySlug: string | null
): Breadcrumb[] => [
  { label: "Blog", href: "/blog" },
  {
    label:
      categories.find((cat) => cat.slug === currentCategorySlug)?.title ||
      "All",
    href: currentCategorySlug || "/blog",
    disabled: true,
  },
];

export const getBlogPostBreadcrumbs = (
  categories: BlogWebinarCategory[],
  blog: SerializedBlog
): Breadcrumb[] => {
  const { title, slug, category } = blog;
  return [
    { label: "Blog", href: "/blog" },
    {
      label:
        categories.find((cat) => cat.slug === category.slug)?.title || "All",
      href: `/blog/categories/${category.slug}`,
    },
    {
      label: title,
      href: slug,
      disabled: true,
    },
  ];
};
