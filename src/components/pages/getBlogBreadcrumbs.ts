import { BlogWebinarCategory } from "../../node-lib/cms";
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
  categorySlug: string | null
): Breadcrumb[] => [
  { label: "Blog", href: "/blog" },
  {
    label: categories.find((cat) => cat.slug === categorySlug)?.title || "All",
    href: categorySlug || "/blog",
    disabled: true,
  },
];
