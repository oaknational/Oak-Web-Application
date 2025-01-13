import { FC } from "react";
import { OakFlex, OakBox, OakBoxProps } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";
import CategoryFilterList from "@/components/SharedComponents/CategoryFilterList";
import useCategoryFilterList from "@/components/SharedComponents/CategoryFilterList/useCategoryFilterList";
import {
  BlogListingLinkProps,
  WebinarListingLinkProps,
} from "@/common-lib/urls";
import Icon from "@/components/SharedComponents/Icon";

export type PostCategoryPage = "blog-index" | "webinar-index";

export type PostCategoryListProps = OakBoxProps & {
  labelledBy: string;
  categories: { slug: string; title: string }[];
  selectedCategorySlug?: string | null;
  page: PostCategoryPage;
};
const PostCategoryList: FC<PostCategoryListProps> = (props) => {
  const { categories, selectedCategorySlug, labelledBy, page, ...boxProps } =
    props;
  const { getIsSelected, setSelected } = useCategoryFilterList({
    selectedKey: selectedCategorySlug,
    getKey: (linkProps: BlogListingLinkProps | WebinarListingLinkProps) =>
      linkProps.categorySlug || null,
  });

  return (
    <OakBox {...boxProps}>
      <CategoryFilterList
        labelledBy={labelledBy}
        getIsSelected={getIsSelected}
        setSelected={setSelected}
        categories={[
          { label: "All", linkProps: { page } },
          ...categories.map(({ title, slug }) => ({
            label: title,
            linkProps: { page, categorySlug: slug },
          })),
        ]}
      />
      <OakFlex
        $mt="space-between-m2"
        $height="all-spacing-7"
        $font={"heading-7"}
      >
        <OwaLink
          $display="flex"
          $width={"auto"}
          $height="100%"
          $alignItems="center"
          page={page === "webinar-index" ? "blog-index" : "webinar-index"}
        >
          {`Switch to ${page === "blog-index" ? "webinars" : "blogs"}`}
          <Icon
            $ml={12}
            variant="brush"
            size={30}
            $background={"blue"}
            name="arrow-right"
          />
        </OwaLink>
      </OakFlex>
    </OakBox>
  );
};

export default PostCategoryList;
