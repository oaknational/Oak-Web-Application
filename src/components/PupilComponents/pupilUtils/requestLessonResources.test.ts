import { requestLessonResources } from "./requestLessonResources";

import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { getCaptionsFromFile } from "@/utils/handleTranscript";

jest.mock("@/utils/handleTranscript", () => {
  return {
    ...jest.requireActual("@/utils/handleTranscript"),
    getCaptionsFromFile: jest.fn().mockResolvedValue([]),
  };
});

describe("requestLessonResources", () => {
  const lessonDownloadsCanonicalResponse = {
    downloads: [],
    isLegacy: false,
    lessonSlug: "lessonSlug",
    lessonTitle: "lessonTitle",
    hasDownloadableResources: false,
    expired: false,
    pathways: [],
    updatedAt: "2021-01-01T00:00:00.000Z",
  };

  let getDownloadResourcesExistenceSpy: jest.SpyInstance;
  beforeEach(() => {
    getDownloadResourcesExistenceSpy = jest
      .spyOn(curriculumApi2023, "lessonDownloads")
      .mockResolvedValue({
        ...lessonDownloadsCanonicalResponse,
        isSpecialist: false,
      });
  });
  afterEach(() => {
    getDownloadResourcesExistenceSpy.mockRestore();
  });

  it("for legacy lessons it splits the transcript into sentences", async () => {
    const transcriptSentences = [
      "This is a sentence. This is another sentence.",
    ];

    const res = await requestLessonResources({
      lessonContent: lessonContentFixture({
        isLegacy: true,
        transcriptSentences,
      }),
    });

    expect(res).toEqual(["This is a sentence.", "This is another sentence."]);
  });

  it("for non-legacy lessons it uses MV transcript when present (no GCS fetch)", async () => {
    const transcriptSentences = ["Sentence one.", "Sentence two."];

    const res = await requestLessonResources({
      lessonContent: lessonContentFixture({
        isLegacy: false,
        videoTitle: "some-video-title",
        transcriptSentences,
      }),
    });

    expect(getCaptionsFromFile).not.toHaveBeenCalled();
    expect(res).toEqual(transcriptSentences);
  });

  it("for non-legacy lessons it formats MV transcript string when present (no GCS fetch)", async () => {
    const transcriptSentences = "This is a sentence. This is another sentence.";

    const res = await requestLessonResources({
      lessonContent: lessonContentFixture({
        isLegacy: false,
        videoTitle: "some-video-title",
        transcriptSentences,
      }),
    });

    expect(getCaptionsFromFile).not.toHaveBeenCalled();
    expect(res).toEqual(["This is a sentence.", "This is another sentence."]);
  });

  it("for non-legacy lessons it fetches transcript from GCS when MV transcript is missing", async () => {
    (getCaptionsFromFile as jest.Mock).mockResolvedValueOnce([
      "From GCS one.",
      "From GCS two.",
    ]);

    const res = await requestLessonResources({
      lessonContent: lessonContentFixture({
        isLegacy: false,
        videoTitle: "video-title-matching-gcs",
        transcriptSentences: undefined,
      }),
    });

    expect(getCaptionsFromFile).toHaveBeenCalledWith(
      "video-title-matching-gcs.vtt",
    );
    expect(res).toEqual(["From GCS one.", "From GCS two."]);
  });
});
