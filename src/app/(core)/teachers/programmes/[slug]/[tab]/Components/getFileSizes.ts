import { DOWNLOAD_TYPE_LABELS } from "@/components/CurriculumComponents/CurriculumDownloadView/helper";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumDownloadsTierSubjectProps } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";
import { contentLengthFromResource } from "@/utils/resource";

export async function getFileSizes(
  subjectPhaseKeystageSlugs: CurriculumSelectionSlugs,
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps,
  mvRefreshTime: number,
) {
  const downloadUrls = DOWNLOAD_TYPE_LABELS.flatMap(({ id: downloadId }) => {
    function genItem(tier: string | null, childSubject: string | null) {
      return {
        id: downloadId,
        tier,
        childSubject,
        url:
          process.env.NEXT_PUBLIC_CLIENT_APP_BASE_URL +
          createCurriculumDownloadsUrl(
            [downloadId],
            "published",
            mvRefreshTime,
            subjectPhaseKeystageSlugs.subjectSlug,
            subjectPhaseKeystageSlugs.phaseSlug,
            subjectPhaseKeystageSlugs.ks4OptionSlug,
            tier,
            childSubject,
          ),
      };
    }
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
              return genItem(tier.tier_slug, child_subject.subject_slug);
            });
          } else {
            return [genItem(null, child_subject.subject_slug)];
          }
        },
      );
    } else if (
      curriculumDownloadsTabData.tiers &&
      curriculumDownloadsTabData.tiers.length > 0
    ) {
      return curriculumDownloadsTabData.tiers.map((tier) => {
        return genItem(tier.tier_slug, null);
      });
    } else {
      return [genItem(null, null)];
    }
  });

  const fileSizes = await Promise.all(
    downloadUrls.map(async ({ id, url, tier, childSubject }) => {
      return {
        downloadId: id,
        size: await contentLengthFromResource(url),
        tier,
        childSubject,
      };
    }),
  );

  return fileSizes;
}
