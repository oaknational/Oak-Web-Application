import {
  sortDownloadResources,
  sortResourcesByOrder,
  sortShareResources,
} from "./sortResources";

import * as downloadResources from "@/node-lib/curriculum-api-2023/fixtures/downloads.fixture";
import * as shareResources from "@/node-lib/curriculum-api-2023/fixtures/shareableResources.fixture";

const sortOrderKey = {
  presentation: 1,
  "worksheet-pdf": 2,
  "worksheet-pptx": 3,
  "intro-quiz-questions": 4,
  "intro-quiz-answers": 5,
  "exit-quiz-questions": 6,
  "exit-quiz-answers": 7,
  "supplementary-pdf": 8,
  "supplementary-docx": 9,
  video: 10,
  "curriculum-pdf": 11,
  "lesson-guide-pdf": 12,
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
