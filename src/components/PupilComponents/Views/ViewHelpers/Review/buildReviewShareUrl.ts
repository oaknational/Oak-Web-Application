import { resolveOakHref } from "@/common-lib/urls";

export const buildReviewShareUrl = ({
  lessonSlug,
  attemptId,
}: {
  lessonSlug: string;
  attemptId: string;
}) => {
  return `${process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL}${resolveOakHref({
    page: "pupil-lesson-results-canonical-share",
    lessonSlug,
    attemptId,
  })}`;
};
