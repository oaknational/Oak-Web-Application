import { FC, useEffect, useState } from "react";

import Box, { BoxProps } from "../Box";
import { P, UL } from "../Typography";

import BlogCategoryListItem from "./BlogCategoryListItem";

type BlogCategoryListProps = BoxProps & {
  categories: { slug: string; title: string }[];
  selectedCategorySlug: string | null;
};
const BlogCategoryList: FC<BlogCategoryListProps> = (props) => {
  const { categories, selectedCategorySlug, ...boxProps } = props;
  const [visiblySelected, setVisiblySelected] = useState(selectedCategorySlug);
  useEffect(() => {
    setVisiblySelected(selectedCategorySlug);
  }, [selectedCategorySlug]);
  return (
    <Box {...boxProps}>
      {/* @todo this should be a heading once we refactor typography */}
      <P $fontSize={14} $fontFamily={"body"}>
        Categories
      </P>
      <UL $mt={24}>
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
    </Box>
  );
};

export default BlogCategoryList;
