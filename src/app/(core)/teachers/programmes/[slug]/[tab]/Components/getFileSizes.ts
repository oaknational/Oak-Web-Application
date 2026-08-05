import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { CurriculumDownloadsTierSubjectProps } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { getFile } from "@/pages/api/curriculum-downloads";

export const DOWNLOAD_TYPE_LABELS: {
  id: string;
  label: string;
  disabled?: boolean;
  icon: "curriculum-plan" | "spreadsheet";
  subTitle?: string;
  fileExt: string;
}[] = [
  {
    id: "curriculum-plans",
    label: "Curriculum plan",
    subTitle: "Word (accessible)",
    icon: "curriculum-plan",
    fileExt: "DOCX",
  },
  {
    id: "national-curriculum",
    label: "National curriculum",
    subTitle: "Excel (accessible)",
    icon: "spreadsheet",
    fileExt: "XLSX",
  },
];

export async function getFileSizes(
  subjectPhaseKeystageSlugs: CurriculumSelectionSlugs,
  curriculumDownloadsTabData: CurriculumDownloadsTierSubjectProps,
) {
  const files = DOWNLOAD_TYPE_LABELS.flatMap(({ id: downloadId }) => {
    function genItem(tier: string | null, childSubject: string | null) {
      return {
        id: downloadId,
        tier,
        childSubject,
        buffer: getFile({
          types: [downloadId],
          subjectSlug: subjectPhaseKeystageSlugs.subjectSlug,
          phaseSlug: subjectPhaseKeystageSlugs.phaseSlug,
          state: "published",
          ks4OptionSlug: subjectPhaseKeystageSlugs.ks4OptionSlug ?? undefined,
          tierSlug: tier ?? undefined,
          childSubjectSlug: childSubject ?? undefined,
        }),
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
    files.map(async ({ id, buffer, tier, childSubject }) => {
      return {
        downloadId: id,
        size: (await buffer).buffer.length,
        tier,
        childSubject,
      };
    }),
  );

  return fileSizes;
}
