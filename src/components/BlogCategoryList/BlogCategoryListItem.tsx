import { FC } from "react";

import { PixelSpacing } from "../../styles/theme";
import Flex from "../Flex";
import Icon from "../Icon";
import OakLink from "../OakLink";
import { LI } from "../Typography";

type BlogCategoryListItemProps = {
  isSelected: boolean;
  category: { title: string; slug: string } | { title: "All"; slug: null };
  setSelected: (slug: string | null) => void;
};
const BlogCategoryListItem: FC<BlogCategoryListItemProps> = (props) => {
  const {
    category: { slug, title },
    isSelected,
    setSelected,
  } = props;
  const arrowHidden = !isSelected;

  const onClick = () => {
    setSelected(slug);
  };

  const ICON_SIZE: [PixelSpacing, PixelSpacing] = [20, 30];
  const ICON_MARGIN_RIGHT: [PixelSpacing, PixelSpacing] = [16, 12];
  // translate to account for absolutely positioned icon
  const TRANSLATE_X = [
    ICON_SIZE[0] + ICON_MARGIN_RIGHT[0],
    ICON_SIZE[1] + ICON_MARGIN_RIGHT[1],
  ];

  return (
    <LI
      $display="flex"
      $height={30}
      $font={"heading-7"}
      $opacity={isSelected ? 0.6 : 1}
      $position="relative"
      $overflow="hidden"
      $alignItems="center"
    >
      <OakLink
        $display="flex"
        $height="100%"
        $alignItems="center"
        page="blog-index"
        category={slug}
        htmlAnchorProps={{
          onClick,
          "aria-current": isSelected ? "page" : undefined,
        }}
      >
        <Icon
          name="ArrowRight"
          size={ICON_SIZE}
          $mr={ICON_MARGIN_RIGHT}
          $opacity={arrowHidden ? 0 : 1}
          $position="absolute"
          $transform={
            arrowHidden
              ? TRANSLATE_X.map((x) => `translateX(-${x}px)`)
              : "translateX(0px)"
          }
          $transition="all 0.1s ease"
          aria-hidden
        />
        <Flex
          $alignItems="center"
          $transition="all 0.1s ease"
          $transform={
            !arrowHidden
              ? TRANSLATE_X.map((x) => `translateX(${x}px)`)
              : "translateX(0)"
          }
          $width="100%"
        >
          {title}
        </Flex>
      </OakLink>
    </LI>
  );
};

export default BlogCategoryListItem;
