import {
  // sortDownloadResources,
  sortResourcesByOrder,
  sortShareResources,
} from "./sortResources";

import * as downloadResources from "@/node-lib/curriculum-api-2023/fixtures/downloads.fixture";
import * as shareResources from "@/node-lib/curriculum-api-2023/fixtures/shareableResources.fixture";

const sortOrderKey = {
  "intro-quiz-questions": 1,
  video: 2,
  "worksheet-pdf": 3,
  "intro-quiz-answers": 4,
  "exit-quiz-questions": 5,
  "starter-quiz": 6,
  "exit-quiz": 7,
  presentation: 100,
  "worksheet-pptx": 100,
  "exit-quiz-answers": 100,
  "supplementary-pdf": 100,
  "supplementary-docx": 100,
  "curriculum-pdf": 100,
  "lesson-guide-pdf": 100,
  "additional-files": 100,
};

describe("sortResources", () => {
  it("sorts resources by the given order", () => {
    const sorted = sortResourcesByOrder(
      downloadResources.allResources,
      sortOrderKey,
    );
    expect(sorted[0]?.type).toBe("presentation");
  });
  // it("sorts download resources", () => {
  //   const sorted = sortDownloadResources(downloadResources.noSlideDeck);
  //   expect(sorted[0]?.type).toBe("worksheet-pdf");
  // });
  it("sorts share resources", () => {
    const sorted = sortShareResources(shareResources.allResources);
    expect(sorted[0]?.type).toBe("video");
  });
});
