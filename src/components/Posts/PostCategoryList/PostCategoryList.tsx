import { FC } from "react";

import Box, { BoxProps } from "../../Box";
import OakLink from "../../OakLink";
import Icon from "../../Icon";
import Flex from "../../Flex";
import CategoryFilterList from "../../Filters/CategoryFilterList";
import useCategoryFilterList from "../../Filters/CategoryFilterList/useCategoryFilterList";
import { PostIndexLinkProps } from "../../../common-lib/urls";

export type PostCategoryPage = "blog-index" | "webinars-index";

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
    getKey: (linkProps: PostIndexLinkProps) => linkProps.category || null,
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
      </Flex>
    </Box>
  );
};

export default PostCategoryList;
