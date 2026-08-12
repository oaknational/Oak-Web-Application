import { OakLI, OakLink } from "@oaknational/oak-components";

import type { LearningThemeSelectedTrackingProps } from "@/components/SharedComponents/CategoryFilterList";
import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";
import { useTeacherBrowseAnalyticsOptional } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type CategoryLinkProps = ResolveOakHrefProps;
export interface Category<T extends CategoryLinkProps> {
  linkProps: T;
  label: string;
}

interface CategoryFilterListItemProps<T extends CategoryLinkProps>
  extends Category<T> {
  isSelected: boolean;
  setSelected: (category: T) => void;
  trackingProps?: LearningThemeSelectedTrackingProps;
}
const CategoryFilterListItem = <T extends CategoryLinkProps>(
  props: CategoryFilterListItemProps<T>,
) => {
  const { label, linkProps, isSelected, setSelected, trackingProps } = props;
  const arrowHidden = !isSelected;

  const track = useTeacherBrowseAnalyticsOptional((store) => store.track);

  const onClick = () => {
    setSelected(linkProps);

    if (trackingProps) {
      const { keyStageSlug, subjectSlug } = trackingProps;

      track?.programmeRefined({
        componentType: "filter_link",
        filterType: "Learning theme filter",
        filterValue: label,
        activeFilters: { keyStage: [keyStageSlug], subject: [subjectSlug] },
      });
    }
  };

  return (
    <OakLI
      $display="flex"
      $font={"heading-7"}
      $position="relative"
      $overflow="visible"
      $alignItems="center"
      $color={isSelected ? "text-subdued" : "text-primary"}
      $mb="spacing-12"
    >
      <OakLink
        variant="secondary"
        aria-current={isSelected ? true : undefined}
        href={resolveOakHref({ ...linkProps })}
        onClick={onClick}
        iconName={arrowHidden ? undefined : "arrow-right"}
      >
        {label}
      </OakLink>
    </OakLI>
  );
};

export default CategoryFilterListItem;
