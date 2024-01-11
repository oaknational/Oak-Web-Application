import { FC } from "react";

import Box, { BoxProps } from "@/components/SharedComponents/Box";
import OakLink from "@/components/OakLink";
import CategoryFilterList from "@/components/Filters/CategoryFilterList";
import useCategoryFilterList from "@/components/Filters/CategoryFilterList/useCategoryFilterList";
import {
  BlogListingLinkProps,
  WebinarListingLinkProps,
} from "@/common-lib/urls";
import Icon from "@/components/SharedComponents/Icon";
import Flex from "@/components/SharedComponents/Flex";

export type PostCategoryPage = "blog-index" | "webinar-index";

export type PostCategoryListProps = BoxProps & {
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
    <Box {...boxProps}>
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
      <Flex $mt={32} $height={30} $font={"heading-7"}>
        <OakLink
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
        </OakLink>
      </Flex>
    </Box>
  );
};

export default PostCategoryList;
