import { getPageLinksForLesson } from "../helpers/lessonHelpers/getPageLinksForLessons";
import { LessonPageLinkAnchorId } from "../helpers/lessonHelpers/lesson.helpers";

const getNextPageLink = (
  anchorId: LessonPageLinkAnchorId,
  pageLinks: ReturnType<typeof getPageLinksForLesson>,
) => {
  // Additional material is the last possible item on the page so the next page link is the footer
  if (anchorId === "additional-material") {
    return "site-footer";
  }

  const indexOfNextPageLink =
    pageLinks.findIndex((link) => link.anchorId === anchorId) + 1;
  const nextPageLink = pageLinks[indexOfNextPageLink];
  return nextPageLink?.anchorId || undefined;
};

export const getSkipLinkUrl = (
  anchorId: LessonPageLinkAnchorId,
  pageLinks: ReturnType<typeof getPageLinksForLesson>,
  lessonSlug?: string,
) => {
  if (!lessonSlug) {
    return;
  }
  const skippableContentSections = [
    "video",
    "lesson-guide",
    "worksheet",
    "slide-deck",
    "quiz",
    "media-clips",
    "additional-material",
  ];

  const skipContentAnchor = skippableContentSections.includes(anchorId)
    ? getNextPageLink(anchorId, pageLinks)
    : undefined;

  return skipContentAnchor ? `${lessonSlug}#${skipContentAnchor}` : undefined;
};
