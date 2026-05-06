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
  LessonDownloadsCanonicalLinkProps,
  LessonDownloadsLinkProps,
  LessonShareCanonicalLinkProps,
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
  unitSlug: string | null;
  programmeSlug: string | null;
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
    | LessonShareCanonicalLinkProps
    | SpecialistLessonShareLinkProps => {
    const query = isPreselectedShareType(preselected)
      ? { preselected }
      : undefined;

    if (isSpecialist && programmeSlug && unitSlug) {
      return {
        page: "specialist-lesson-share",
        lessonSlug,
        unitSlug,
        programmeSlug,
        query,
      };
    }

    if (programmeSlug && unitSlug) {
      return {
        page: "lesson-share",
        lessonSlug,
        unitSlug,
        programmeSlug,
        query,
      };
    }

    return {
      page: "lesson-share-canonical",
      lessonSlug,
      query,
    };
  };

  const shareLinkProps = getShareLinkProps();

  const getDownloadLinkProps = ():
    | LessonDownloadsLinkProps
    | IntegratedLessonDownloadsLinkProps
    | LessonDownloadsCanonicalLinkProps
    | SpecialistLessonDownloadsLinkProps => {
    const query = isPreselectedDownloadType(preselected)
      ? { preselected }
      : undefined;

    if (isSpecialist && programmeSlug && unitSlug) {
      return {
        page: "specialist-lesson-downloads",
        lessonSlug,
        unitSlug,
        programmeSlug,
        downloads: "downloads",
        query,
      };
    }

    if (programmeSlug && unitSlug) {
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
    }

    return {
      page: "lesson-downloads-canonical",
      downloads: "downloads",
      lessonSlug,
      query,
    };
  };

  const downloadLinkProps = getDownloadLinkProps();
  const linkProps = page === "share" ? shareLinkProps : downloadLinkProps;
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
