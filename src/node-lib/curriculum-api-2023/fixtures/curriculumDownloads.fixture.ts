import { CurriculumDownloadsTabData } from "..";

const curriculumDownloadsTabFixture = (
  partial?: Partial<CurriculumDownloadsTabData>
): CurriculumDownloadsTabData => ({
  ...{
    urls: ["/placeholder-download-url"],
  },
  ...partial,
});
export default curriculumDownloadsTabFixture;
