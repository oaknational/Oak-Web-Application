import usePersistResourceFormDetails from "./usePersistResourceFormDetails";

import type { ResourceFormValues } from "@/components/TeacherComponents/types/downloadAndShare.types";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { createCurriculumDownloadsUrl } from "@/utils/curriculum/urls";
import { downloadFileFromUrl } from "@/components/SharedComponents/helpers/downloadFileFromUrl";

export type CurriculumDownloadProps = {
  data: ResourceFormValues;
  mvRefreshTime: number;
  slugs: CurriculumSelectionSlugs;
  tierSlug: string | null;
  childSubjectSlug: string | null;
};

const useCurriculumDownload = () => {
  const { persistResourceFormDetails } = usePersistResourceFormDetails();

  const onSubmit = async ({
    data,
    mvRefreshTime,
    slugs,
    tierSlug,
    childSubjectSlug,
  }: CurriculumDownloadProps) => {
    persistResourceFormDetails(data);
    const downloadPath = createCurriculumDownloadsUrl(
      data.resources,
      "published",
      mvRefreshTime,
      slugs.subjectSlug,
      slugs.phaseSlug,
      slugs.ks4OptionSlug,
      tierSlug,
      childSubjectSlug,
    );
    await downloadFileFromUrl(downloadPath);
  };

  return { onSubmit };
};

export default useCurriculumDownload;
