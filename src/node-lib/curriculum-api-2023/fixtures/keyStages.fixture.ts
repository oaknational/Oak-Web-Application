import { KeyStagesData } from "..";

const keyStagesFixture = (partial?: Partial<KeyStagesData>): KeyStagesData => {
  return {
    keyStages: [
      { shortCode: "KS1", slug: "ks1", title: "Key Stage 1", displayOrder: 2 },
      { shortCode: "KS2", slug: "ks2", title: "Key Stage 2", displayOrder: 3 },
      { shortCode: "KS3", slug: "ks3", title: "Key Stage 3", displayOrder: 4 },
      { shortCode: "KS4", slug: "ks4", title: "Key Stage 4", displayOrder: 5 },
      { shortCode: "EYFS", slug: "eyfs", title: "EYFS", displayOrder: 1 },
    ],
    ...partial,
  };
};

export default keyStagesFixture;
