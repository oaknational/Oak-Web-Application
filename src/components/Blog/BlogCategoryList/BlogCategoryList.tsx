import { FC, useEffect, useState } from "react";

import { BoxProps } from "../../Box";
import { UL } from "../../Typography";

import BlogCategoryListItem from "./BlogCategoryListItem";

export type BlogCategoryListProps = BoxProps & {
  labelledBy: string;
  categories: { slug: string; title: string }[];
  selectedCategorySlug?: string | null;
  page: "blog-index" | "webinars-index";
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
              key={`BlogCategoryList-${category.slug}`}
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
