import { CurriculumDownloadTabData } from "..";

const curriculumDownloadTabFixture = (
  partial?: Partial<CurriculumDownloadTabData>
): CurriculumDownloadTabData => ({
  ...{
    urls: ["/placeholder-download-url"],
  },
  ...partial,
});
export default curriculumDownloadTabFixture;
