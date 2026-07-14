import { OakInlineBanner } from "@oaknational/oak-components";

import { usePupilLessonProgress } from "@/context/PupilLessonProgress";

export const PupilReadOnlyBanner = () => {
  const isReadOnly = usePupilLessonProgress((state) => state.isReadOnly);

  return (
    <OakInlineBanner
      message="You have turned-in this assignment. You can review the lesson and see your previous answers."
      isOpen={isReadOnly}
    />
  );
};
