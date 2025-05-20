import {
  sortDownloadResources,
  sortResourcesByOrder,
  sortShareResources,
} from "./sortResources";

import * as downloadResources from "@/node-lib/curriculum-api-2023/fixtures/downloads.fixture";
import * as shareResources from "@/node-lib/curriculum-api-2023/fixtures/shareableResources.fixture";

const sortOrderKey = {
  "lesson-guide-pdf": 1,
  presentation: 2,
  "worksheet-pdf": 3,
  "worksheet-pptx": 4,
  "intro-quiz-questions": 5,
  "intro-quiz-answers": 6,
  "exit-quiz-questions": 7,
  "exit-quiz-answers": 8,
  "supplementary-pdf": 9,
  "supplementary-docx": 10,
  video: 11,
  "curriculum-pdf": 12,
  "additional-files": 13,
};

describe("sortResources", () => {
  it("sorts resources by the given order", () => {
    const sorted = sortResourcesByOrder(
      downloadResources.allResources,
      sortOrderKey,
    );
    expect(sorted[0]?.type).toBe("presentation");
  });
  it("sorts download resources", () => {
    const sorted = sortDownloadResources(downloadResources.noSlideDeck);
    expect(sorted[0]?.type).toBe("worksheet-pdf");
  });
  it("sorts share resources", () => {
    const sorted = sortShareResources(shareResources.allResources);
    expect(sorted[0]?.type).toBe("intro-quiz-questions");
  });
});
