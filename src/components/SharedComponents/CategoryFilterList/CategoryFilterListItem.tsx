import { OakLI, OakSecondaryLink } from "@oaknational/oak-components";

import useAnalytics from "@/context/Analytics/useAnalytics";
import type { LearningThemeSelectedTrackingProps } from "@/components/SharedComponents/CategoryFilterList";
import { resolveOakHref, ResolveOakHrefProps } from "@/common-lib/urls";

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

  const { track } = useAnalytics();

  const onClick = () => {
    setSelected(linkProps);

    if (trackingProps) {
      const { keyStageSlug, subjectSlug } = trackingProps;

      track.browseRefined({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "refine",
        componentType: "filter_link",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
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
      $color={!isSelected ? "text-primary" : "text-subdued"}
      $mb="spacing-12"
    >
      <OakSecondaryLink
        aria-current={isSelected ? true : undefined}
        href={resolveOakHref({ ...linkProps })}
        onClick={onClick}
        iconName={arrowHidden ? undefined : "arrow-right"}
      >
        {label}
      </OakSecondaryLink>
    </OakLI>
  );
};

export default CategoryFilterListItem;
