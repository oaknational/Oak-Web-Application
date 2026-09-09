import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumDownloadsTierSubjectProps } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getFileSize } from "@/pages/api/curriculum-downloads";
import {
  DOWNLOAD_TYPE_LABELS,
  DownloadTypes,
} from "@/components/CurriculumComponents/CurriculumDownloadView/helper";

async function genItem(
  downloadId: DownloadTypes,
  subjectPhaseKeystageSlugs: CurriculumSelectionSlugs,
  tier: string | null,
  childSubject: string | null,
) {
  const size = await getFileSize({
    types: [downloadId],
    subjectSlug: subjectPhaseKeystageSlugs.subjectSlug,
    phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
    state: "published",
    ks4OptionSlug: subjectPhaseKeystageSlugs.ks4OptionSlug ?? undefined,
    tierSlug: tier ?? undefined,
    childSubjectSlug: childSubject ?? undefined,
  });
  return {
    id: downloadId,
    tier,
    childSubject,
    size,
  };
}

export async function getFileSizes(
  subjectPhaseKeystageSlugs: CurriculumSelectionSlugs,
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps,
) {
  const files = DOWNLOAD_TYPE_LABELS.filter(
    ({ group }) => group === "curriculum",
  ).flatMap(({ id: downloadId }) => {
    if (
      curriculumDownloadsTabData.child_subjects &&
      curriculumDownloadsTabData.child_subjects.length > 0
    ) {
      return curriculumDownloadsTabData.child_subjects.flatMap(
        (child_subject) => {
          if (
            curriculumDownloadsTabData.tiers &&
            curriculumDownloadsTabData.tiers.length > 0
          ) {
            return curriculumDownloadsTabData.tiers.map((tier) => {
              return genItem(
                downloadId,
                subjectPhaseKeystageSlugs,
                tier.tier_slug,
                child_subject.subject_slug,
              );
            });
          } else {
            return [
              genItem(
                downloadId,
                subjectPhaseKeystageSlugs,
                null,
                child_subject.subject_slug,
              ),
            ];
          }
        },
      );
    } else if (
      curriculumDownloadsTabData.tiers &&
      curriculumDownloadsTabData.tiers.length > 0
    ) {
      return curriculumDownloadsTabData.tiers.map((tier) => {
        return genItem(
          downloadId,
          subjectPhaseKeystageSlugs,
          tier.tier_slug,
          null,
        );
      });
    } else {
      return [genItem(downloadId, subjectPhaseKeystageSlugs, null, null)];
    }
  });

  const fileAwaited = await Promise.all(files);
  const fileSizes = fileAwaited
    .filter(({ size }) => size > -1)
    .map(({ id, size, tier, childSubject }) => {
      return {
        downloadId: id,
        size: size,
        tier,
        childSubject,
      };
    });

  return fileSizes;
}
