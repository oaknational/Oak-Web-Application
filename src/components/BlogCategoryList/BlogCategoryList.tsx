import { FC, useEffect, useState } from "react";

import { BoxProps } from "../Box";
import { UL } from "../Typography";

import BlogCategoryListItem from "./BlogCategoryListItem";

export type BlogCategoryListProps = BoxProps & {
  categories: { slug: string; title: string }[];
  selectedCategorySlug?: string | null;
};
const BlogCategoryList: FC<BlogCategoryListProps> = (props) => {
  const { categories, selectedCategorySlug, ...boxProps } = props;
  const [visiblySelected, setVisiblySelected] = useState(selectedCategorySlug);
  useEffect(() => {
    setVisiblySelected(selectedCategorySlug);
  }, [selectedCategorySlug]);
  return (
    <UL {...boxProps}>
      <BlogCategoryListItem
        isSelected={visiblySelected === null}
        category={{ slug: null, title: "All" }}
        setSelected={setVisiblySelected}
      />
      {categories.map((category) => {
        return (
          <BlogCategoryListItem
            key={`BlogCategoryList-${category.slug}`}
            isSelected={visiblySelected === category.slug}
            category={category}
            setSelected={setVisiblySelected}
          />
        );
      })}
    </UL>
  );
};

export default BlogCategoryList;
