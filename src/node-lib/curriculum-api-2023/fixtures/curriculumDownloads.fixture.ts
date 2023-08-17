import { CurriculumDownloadsTabData } from "..";

const curriculumDownloadsFixture = (
  partial?: Partial<CurriculumDownloadsTabData>
): CurriculumDownloadsTabData => ({
  ...{
    urls: ["/placeholder-download-url"],
  },
  ...partial,
});
export default curriculumDownloadsFixture;
