import { PixelSpacing } from "../../../styles/theme";
import Icon from "../../Icon";
import OakLink from "../../OakLink";
import { LI } from "../../Typography";
import Flex from "../../Flex";
import { ResolveOakHrefProps } from "../../../common-lib/urls";

export type CategoryLinkProps = ResolveOakHrefProps;
export interface Category<T extends CategoryLinkProps> {
  linkProps: T;
  label: string;
}
interface CategoryFilterListItemProps<T extends CategoryLinkProps>
  extends Category<T> {
  isSelected: boolean;
  setSelected: (category: T) => void;
}
const CategoryFilterListItem = <T extends CategoryLinkProps>(
  props: CategoryFilterListItemProps<T>
) => {
  const { label, linkProps, isSelected, setSelected } = props;
  const arrowHidden = !isSelected;

  const onClick = () => {
    setSelected(linkProps);
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
      $font={"heading-7"}
      $opacity={isSelected ? 0.6 : 1}
      $position="relative"
      $overflow="visisble"
      $alignItems="center"
      $mb={12}
    >
      <OakLink
        $display="flex"
        $height="100%"
        $alignItems="center"
        {...linkProps}
        htmlAnchorProps={{
          onClick,
          "aria-current": isSelected ? "page" : undefined,
        }}
      >
        <Icon
          name="arrow-right"
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
          {label}
        </Flex>
      </OakLink>
    </LI>
  );
};

export default CategoryFilterListItem;
