import { OakSmallTertiaryInvertedButton } from "@oaknational/oak-components";
import Link from "next/link";

import {
  PreselectedDownloadType,
  PreselectedShareType,
  isPreselectedDownloadType,
  isPreselectedShareType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import {
  LessonDownloadsLinkProps,
  LessonShareLinkProps,
  resolveOakHref,
} from "@/common-lib/urls";

export function LessonItemContainerLink({
  resourceTitle,
  onClick,
  lessonSlug,
  unitSlug,
  programmeSlug,
  preselected,
  page,
}: Readonly<{
  page: "share" | "download";
  resourceTitle: string;
  onClick?: () => void;
  lessonSlug: string;
  unitSlug: string;
  programmeSlug: string;
  preselected: PreselectedDownloadType | PreselectedShareType | null;
}>) {
  const label =
    page === "share" ? "Share with pupils" : `Download ${resourceTitle}`;

  const linkProps: LessonShareLinkProps | LessonDownloadsLinkProps =
    page === "share"
      ? {
          page: "lesson-share",
          lessonSlug,
          unitSlug,
          programmeSlug,
          ...(isPreselectedShareType(preselected)
            ? { query: { preselected } }
            : {}),
        }
      : {
          page: "lesson-downloads",
          lessonSlug,
          unitSlug,
          programmeSlug,
          ...(isPreselectedDownloadType(preselected)
            ? { query: { preselected } }
            : {}),
        };

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
