import { OakUL, OakBoxProps } from "@oaknational/oak-components";

import CategoryFilterListItem, {
  Category,
  CategoryLinkProps,
} from "./CategoryFilterListItem";

export type LearningThemeSelectedTrackingProps = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjectTitle: string;
  subjectSlug: string;
};

export interface CategoryFilterListProps<T extends CategoryLinkProps>
  extends OakBoxProps {
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
      <OakUL {...boxProps} $reset $mr={"space-between-m2"}>
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
      </OakUL>
    </nav>
  );
};

export default CategoryFilterList;
