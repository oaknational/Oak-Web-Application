import { OakTertiaryButton } from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

type ViewAllLessonsButtonProps = {
  href?: string | null;
};

/**
 * A tertiary button to link back to the directory of lessons
 */
export const ViewAllLessonsButton = ({ href }: ViewAllLessonsButtonProps) => {
  if (href) {
    if (
      href ===
      resolveOakHref({
        page: "pupil-year-index",
      })
    ) {
      return (
        <OakTertiaryButton iconName="arrow-left" href={href} element="a">
          Take me home
        </OakTertiaryButton>
      );
    }
    return (
      <OakTertiaryButton iconName="arrow-left" href={href} element="a">
        View all lessons
      </OakTertiaryButton>
    );
  }

  return (
    <OakTertiaryButton disabled iconName="arrow-left">
      View all lessons
    </OakTertiaryButton>
  );
};
