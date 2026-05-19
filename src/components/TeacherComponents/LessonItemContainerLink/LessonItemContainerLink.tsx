import { OakSmallTertiaryInvertedButton } from "@oaknational/oak-components";
import Link from "next/link";

import {
  PreselectedDownloadType,
  PreselectedShareType,
  isPreselectedDownloadType,
  isPreselectedShareType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import {
  IntegratedLessonDownloadsLinkProps,
  LessonDownloadsLinkProps,
  LessonShareLinkProps,
  resolveOakHref,
  SpecialistLessonDownloadsLinkProps,
  SpecialistLessonShareLinkProps,
} from "@/common-lib/urls";

export function LessonItemContainerLink({
  resourceTitle,
  onClick,
  lessonSlug,
  unitSlug,
  programmeSlug,
  preselected,
  page,
  isSpecialist,
  isIntegratedJourney = false,
}: Readonly<{
  page: "share" | "download";
  resourceTitle: string;
  onClick?: () => void;
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
  preselected: PreselectedDownloadType | PreselectedShareType | null;
  isSpecialist: boolean;
  /**
   * If true, use the integrated lesson downloads page.
   *
   * Can be consolidated once the integrated journey is fully rolled out.
   */
  isIntegratedJourney?: boolean;
}>) {
  const label =
    page === "share" ? "Share with pupils" : `Download ${resourceTitle}`;

  const getShareLinkProps = ():
    | LessonShareLinkProps
    | SpecialistLessonShareLinkProps => {
    const query = isPreselectedShareType(preselected)
      ? { preselected }
      : undefined;

    if (isSpecialist) {
      return {
        page: "specialist-lesson-share",
        lessonSlug,
        unitSlug,
        programmeSlug,
        query,
      };
    }

    return {
      page: "lesson-share",
      lessonSlug,
      unitSlug,
      programmeSlug,
      query,
    };
  };

  const getDownloadLinkProps = ():
    | LessonDownloadsLinkProps
    | IntegratedLessonDownloadsLinkProps
    | SpecialistLessonDownloadsLinkProps => {
    const query = isPreselectedDownloadType(preselected)
      ? { preselected }
      : undefined;

    if (isSpecialist) {
      return {
        page: "specialist-lesson-downloads",
        lessonSlug,
        unitSlug,
        programmeSlug,
        downloads: "downloads",
        query,
      };
    }

    if (isIntegratedJourney) {
      return {
        page: "integrated-lesson-downloads",
        lessonSlug,
        unitSlug,
        programmeSlug,
        query,
      };
    }

    return {
      page: "lesson-downloads",
      lessonSlug,
      unitSlug,
      programmeSlug,
      downloads: "downloads",
      query,
    };
  };

  const linkProps =
    page === "share" ? getShareLinkProps() : getDownloadLinkProps();
  const href = resolveOakHref(linkProps);

  return (
    <OakSmallTertiaryInvertedButton
      element={Link}
      href={href}
      iconName="download"
      isTrailingIcon
      data-testid="download-button"
      rel="nofollow"
      onClick={onClick}
    >
      {label}
    </OakSmallTertiaryInvertedButton>
  );
}
