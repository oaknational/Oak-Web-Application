import ButtonAsLink, {
  ButtonAsLinkProps,
} from "@/components/SharedComponents/Button/ButtonAsLink";
import {
  PreselectedDownloadType,
  PreselectedShareType,
  isPreselectedDownloadType,
  isPreselectedShareType,
} from "@/components/TeacherComponents/types/downloadAndShare.types";
import {
  LessonDownloadsCanonicalLinkProps,
  LessonDownloadsLinkProps,
  LessonShareCanonicalLinkProps,
  LessonShareLinkProps,
} from "@/common-lib/urls";

export function LessonItemContainerLink({
  resourceTitle,
  onClick,
  lessonSlug,
  unitSlug,
  programmeSlug,
  preselected,
  page,
}: {
  page: "share" | "download";
  resourceTitle: string;
  onClick?: () => void;
  lessonSlug: string;
  unitSlug: string | null;
  programmeSlug: string | null;
  preselected: PreselectedDownloadType | PreselectedShareType | null;
}) {
  const buttonProps: Pick<
    ButtonAsLinkProps,
    | "variant"
    | "iconBackground"
    | "icon"
    | "$iconPosition"
    | "label"
    | "onClick"
  > = {
    variant: "minimal",
    iconBackground: "black",
    icon: "arrow-right",
    $iconPosition: "trailing",
    onClick,
    label: page === "share" ? "Share with pupils" : `Download ${resourceTitle}`,
  };

  const shareLinkProps: LessonShareLinkProps | LessonShareCanonicalLinkProps =
    programmeSlug && unitSlug
      ? {
          page: "lesson-share",
          lessonSlug,
          unitSlug,
          programmeSlug,
          query: isPreselectedShareType(preselected)
            ? { preselected }
            : undefined,
        }
      : {
          page: "lesson-share-canonical",
          lessonSlug,
          query: isPreselectedShareType(preselected)
            ? { preselected }
            : undefined,
        };

  const downloadLinkProps:
    | LessonDownloadsLinkProps
    | LessonDownloadsCanonicalLinkProps =
    programmeSlug && unitSlug
      ? {
          page: "lesson-downloads",
          lessonSlug,
          unitSlug,
          programmeSlug,
          query: isPreselectedDownloadType(preselected)
            ? { preselected }
            : undefined,
        }
      : {
          page: "lesson-downloads-canonical",
          lessonSlug,
          query: isPreselectedDownloadType(preselected)
            ? { preselected }
            : undefined,
        };
  const linkProps = page === "share" ? shareLinkProps : downloadLinkProps;

  return (
    <ButtonAsLink
      {...buttonProps}
      data-testid="download-button"
      {...linkProps}
    />
  );
}
