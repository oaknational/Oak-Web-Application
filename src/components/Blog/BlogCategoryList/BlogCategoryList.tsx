import { FC, useEffect, useState } from "react";

import { BoxProps } from "../../Box";
import { UL } from "../../Typography";

import BlogCategoryListItem from "./BlogCategoryListItem";

export type BlogCategoryPage = "blog-index" | "webinars-index";

export type BlogCategoryListProps = BoxProps & {
  labelledBy: string;
  categories: { slug: string; title: string }[];
  selectedCategorySlug?: string | null;
  page: BlogCategoryPage;
};
const BlogCategoryList: FC<BlogCategoryListProps> = (props) => {
  const { categories, selectedCategorySlug, labelledBy, page, ...boxProps } =
    props;
  const [visiblySelected, setVisiblySelected] = useState(selectedCategorySlug);
  useEffect(() => {
    setVisiblySelected(selectedCategorySlug);
  }, [selectedCategorySlug]);

  return (
    <nav aria-labelledby={labelledBy}>
      <UL {...boxProps} $reset>
        <BlogCategoryListItem
          isSelected={visiblySelected === null}
          category={{ slug: null, title: "All" }}
          setSelected={setVisiblySelected}
          page={page}
        />
        {categories.map((category) => {
          return (
            <BlogCategoryListItem
              key={`${page}-CategoryList-${category.slug}`}
              isSelected={visiblySelected === category.slug}
              category={category}
              setSelected={setVisiblySelected}
              page={page}
            />
          );
        })}
      </UL>
    </nav>
  );
};

export default BlogCategoryList;
