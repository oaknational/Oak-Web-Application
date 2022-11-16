import { FC, useEffect, useState } from "react";

import { BoxProps } from "../../Box";
import { LI, UL } from "../../Typography";
import OakLink from "../../OakLink";
import Icon from "../../Icon";

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

        <LI $mt={32} $height={30} $font={"heading-7"}>
          <OakLink
            $display="flex"
            $height="100%"
            $alignItems="center"
            page={page === "webinars-index" ? "blog-index" : "webinars-index"}
          >
            {`Switch to ${page === "blog-index" ? "webinars" : "blogs"}`}
            <Icon
              $ml={12}
              variant="brush"
              size={30}
              $background={"teachersHighlight"}
              name="ArrowRight"
            />
          </OakLink>
        </LI>
      </UL>
    </nav>
  );
};

export default BlogCategoryList;
