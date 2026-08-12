import { OakUL, OakBoxProps } from "@oaknational/oak-components";

import CategoryFilterListItem, {
  Category,
  CategoryLinkProps,
} from "./CategoryFilterListItem";

import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type LearningThemeSelectedTrackingProps = {
  keyStageSlug: string;
  keyStageTitle: string;
  subjectTitle: string;
  subjectSlug: string;
};

export interface CategoryFilterListProps<T extends CategoryLinkProps>
  extends OakBoxProps {
  ariaLabel: string;
  categories: Category<T>[];
  getIsSelected: (category: T) => boolean;
  setSelected: (category: T) => void;
  themeTrackingProps?: LearningThemeSelectedTrackingProps;
}
const CategoryFilterList = <T extends CategoryLinkProps>(
  props: CategoryFilterListProps<T>,
) => {
  const {
    ariaLabel,
    categories,
    getIsSelected,
    setSelected,
    themeTrackingProps: trackingProps,
    ...boxProps
  } = props;

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel={"homepage"}
    >
      <nav aria-label={ariaLabel}>
        <OakUL {...boxProps} $reset $mr={"spacing-32"}>
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
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export default CategoryFilterList;
