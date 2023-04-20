import { TeachersHomePageData } from "..";

const teachersHomePageFixture = (
  partial?: Partial<TeachersHomePageData>
): TeachersHomePageData => {
  return {
    keyStages: [
      { shortCode: "KS1", slug: "ks1", title: "Key stage 1" },
      { shortCode: "KS2", slug: "ks2", title: "Key stage 2" },
      { shortCode: "KS3", slug: "ks3", title: "Key stage 3" },
      { shortCode: "KS4", slug: "ks4", title: "Key tage 4" },
    ],
    ...partial,
  };
};

export default teachersHomePageFixture;
