import { FC } from "react";

import Box, { BoxProps } from "../../Box";
import OakLink from "../../OakLink";
import Icon from "../../Icon";
import Flex from "../../Flex";
import CategoryFilterList from "../../Filters/CategoryFilterList";
import useCategoryFilterList from "../../Filters/CategoryFilterList/useCategoryFilterList";
import {
  BlogListingLinkProps,
  WebinarListingLinkProps,
} from "../../../common-lib/urls";

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
  console.log(selectedCategorySlug, "selectedCategorySlug");
  const { getIsSelected, setSelected } = useCategoryFilterList({
    selectedKey: selectedCategorySlug,
    getKey: (linkProps: BlogListingLinkProps | WebinarListingLinkProps) =>
      linkProps.category || null,
  });

  return (
    <Box {...boxProps}>
      <CategoryFilterList
        labelledBy={labelledBy}
        getIsSelected={getIsSelected}
        setSelected={setSelected}
        categories={[
          { label: "All", linkProps: { page } },
          ...categories.map((cat) => ({
            label: cat.title,
            linkProps: { page, category: cat.slug },
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
            $background={"teachersHighlight"}
            name="arrow-right"
          />
        </OakLink>
      </Flex>
    </Box>
  );
};

export default PostCategoryList;
