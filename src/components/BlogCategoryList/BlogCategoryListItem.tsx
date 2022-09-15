import { FC } from "react";

import Box from "../Box";
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

  const ICON_SIZE = 30;
  const ICON_MARGIN_RIGHT = 12;
  // translate to account for absolutely positioned icon
  const TRANSLATE_X = ICON_SIZE + ICON_MARGIN_RIGHT;

  return (
    <LI
      $display="flex"
      $height={30}
      $alignItems="center"
      $fontFamily={"ui"}
      $opacity={isSelected ? 0.6 : 1}
    >
      <Icon
        name="ArrowRight"
        size={ICON_SIZE}
        $mr={ICON_MARGIN_RIGHT}
        $opacity={arrowHidden ? 0 : 1}
        $position="absolute"
        $transform={
          arrowHidden ? `translateX(-${TRANSLATE_X}px)` : "translateX(0px)"
        }
        $transition="all 0.1s ease"
      />
      <Box
        $transition="all 0.1s ease"
        $transform={
          !arrowHidden ? `translateX(${TRANSLATE_X}px)` : "translateX(0)"
        }
      >
        <OakLink
          page="blog-index"
          category={slug}
          htmlAnchorProps={{ onClick }}
        >
          {title}
        </OakLink>
      </Box>
    </LI>
  );
};

export default BlogCategoryListItem;
