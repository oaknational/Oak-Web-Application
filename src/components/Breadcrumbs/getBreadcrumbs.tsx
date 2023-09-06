import { BlogWebinarCategory } from "../../common-lib/cms-types";
import { SerializedWebinar } from "../../pages/webinars/[webinarSlug]";
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

export type CrumbPageVariant = "blog" | "webinars";

export const getBlogWebinarListBreadcrumbs = (
  categories: BlogWebinarCategory[],
  currentCategorySlug: string | null,
  page: CrumbPageVariant,
  label: string,
): Breadcrumb[] => [
  { label, oakLinkProps: { href: `/${page}`, page: null } },
  {
    label:
      categories.find((cat) => cat.slug === currentCategorySlug)?.title ||
      "All",
    oakLinkProps: { href: currentCategorySlug || `/${page}`, page: null },
    disabled: true,
  },
];

export const getBlogWebinarPostBreadcrumbs = (
  categories: BlogWebinarCategory[],
  blog: SerializedBlog | SerializedWebinar,
  page: CrumbPageVariant,
  label: string,
): Breadcrumb[] => {
  const { title, slug, category } = blog;
  return [
    { label, oakLinkProps: { href: `/${page}`, page: null } },
    {
      label:
        categories.find((cat) => cat.slug === category.slug)?.title || "All",
      oakLinkProps: {
        href: `/${page}/categories/${category.slug}`,
        page: null,
      },
    },
    {
      label: title,
      oakLinkProps: { href: slug, page: null },
      disabled: true,
    },
  ];
};
