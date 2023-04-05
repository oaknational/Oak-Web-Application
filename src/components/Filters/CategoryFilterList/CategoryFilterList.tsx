import { BoxProps } from "../../Box";
import { UL } from "../../Typography";
import type { LearningThemeSelectedTrackingProps } from "../LearningThemeFilters";

import CategoryFilterListItem, {
  Category,
  CategoryLinkProps,
} from "./CategoryFilterListItem";

export interface CategoryFilterListProps<T extends CategoryLinkProps>
  extends BoxProps {
  labelledBy: string;
  categories: Category<T>[];
  getIsSelected: (category: T) => boolean;
  setSelected: (category: T) => void;
  trackingProps?: LearningThemeSelectedTrackingProps;
}
const CategoryFilterList = <T extends CategoryLinkProps>(
  props: CategoryFilterListProps<T>
) => {
  const {
    categories,
    labelledBy,
    getIsSelected,
    setSelected,
    trackingProps,
    ...boxProps
  } = props;

  return (
    <nav aria-labelledby={labelledBy}>
      <UL {...boxProps} $reset $mr={30}>
        {categories.map((category) => {
          return (
            <CategoryFilterListItem
              key={`CategoryFilterListItem-${category.label}`}
              isSelected={getIsSelected(category.linkProps)}
              setSelected={setSelected}
              trackingProps={trackingProps}
              {...category}
            />
          );
        })}
      </UL>
    </nav>
  );
};

export default CategoryFilterList;
