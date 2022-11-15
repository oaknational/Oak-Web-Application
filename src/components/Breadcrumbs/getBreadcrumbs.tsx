import { BlogWebinarCategory } from "../../common-lib/cms-types";
import { SerializedWebinar } from "../../pages/beta/webinars/[webinarSlug]";
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

export type CrumbPageVariant = "blog" | "beta/webinars"; //@TODO: remove "beta/"

export const getBlogWebinarListBreadcrumbs = (
  categories: BlogWebinarCategory[],
  currentCategorySlug: string | null,
  page: CrumbPageVariant,
  label: string
): Breadcrumb[] => [
  { label, href: `/${page}` },
  {
    label:
      categories.find((cat) => cat.slug === currentCategorySlug)?.title ||
      "All",
    href: currentCategorySlug || `/${page}`,
    disabled: true,
  },
];

export const getBlogWebinarPostBreadcrumbs = (
  categories: BlogWebinarCategory[],
  blog: SerializedBlog | SerializedWebinar,
  page: CrumbPageVariant,
  label: string
): Breadcrumb[] => {
  const { title, slug, category } = blog;
  return [
    { label, href: `/${page}` },
    {
      label:
        categories.find((cat) => cat.slug === category.slug)?.title || "All",
      href: `/${page}/categories/${category.slug}`,
    },
    {
      label: title,
      href: slug,
      disabled: true,
    },
  ];
};
