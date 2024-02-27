import { OakTertiaryButton } from "@oaknational/oak-components";

type ViewAllLessonsButtonProps = {
  href?: string | null;
};

/**
 * A tertiary button to link back to the directory of lessons
 */
export const ViewAllLessonsButton = ({ href }: ViewAllLessonsButtonProps) => {
  if (href) {
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
