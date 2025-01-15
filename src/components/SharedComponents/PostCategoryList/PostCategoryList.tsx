import { FC } from "react";
import {
  OakFlex,
  OakTertiaryButton,
  OakBox,
  OakBoxProps,
} from "@oaknational/oak-components";

import CategoryFilterList from "@/components/SharedComponents/CategoryFilterList";
import useCategoryFilterList from "@/components/SharedComponents/CategoryFilterList/useCategoryFilterList";
import {
  BlogListingLinkProps,
  WebinarListingLinkProps,
  resolveOakHref,
} from "@/common-lib/urls";

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
        <OakTertiaryButton
          element={"a"}
          href={
            page === "webinar-index"
              ? resolveOakHref({ page: "blog-index" })
              : resolveOakHref({ page: "webinar-index" })
          }
          iconName={"arrow-right"}
          isTrailingIcon
        >
          {`Switch to ${page === "blog-index" ? "webinars" : "blogs"}`}
        </OakTertiaryButton>
      </OakFlex>
    </OakBox>
  );
};

export default PostCategoryList;
