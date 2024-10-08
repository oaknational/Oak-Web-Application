import CategoryFilterListItem, {
  Category,
  CategoryLinkProps,
} from "./CategoryFilterListItem";

import { BoxProps } from "@/components/SharedComponents/Box";
import { UL } from "@/components/SharedComponents/Typography";

export type LearningThemeSelectedTrackingProps = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjectTitle: string;
  subjectSlug: string;
};

export interface CategoryFilterListProps<T extends CategoryLinkProps>
  extends BoxProps {
  labelledBy: string;
  categories: Category<T>[];
  getIsSelected: (category: T) => boolean;
  setSelected: (category: T) => void;
  themeTrackingProps?: LearningThemeSelectedTrackingProps;
}
const CategoryFilterList = <T extends CategoryLinkProps>(
  props: CategoryFilterListProps<T>,
) => {
  const {
    categories,
    labelledBy,
    getIsSelected,
    setSelected,
    themeTrackingProps: trackingProps,
    ...boxProps
  } = props;

  return (
    <nav aria-labelledby={labelledBy}>
      <UL {...boxProps} $gap={0} $reset $mr={30}>
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
