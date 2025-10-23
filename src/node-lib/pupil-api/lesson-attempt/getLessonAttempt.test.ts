import { LessonAttemptFixture } from "@/node-lib/pupil-api/__mocks__/fixtures/lesson-attempt.fixture";
import { pupilDatastore } from "@/node-lib/pupil-api/pupilDataStore";

jest.mock("@bugsnag/js");
jest.mock("@google-cloud/firestore");

describe("getLessonAttempt", () => {
  it("should fetch the lesson attempt by the attemptId", async () => {
    const { attempts } = await pupilDatastore.getLessonAttempt({
      attemptId: "sNHeiaNYiplPq62goZXUM",
    });
    expect(attempts).toEqual({
      sNHeiaNYiplPq62goZXUM: {
        ...LessonAttemptFixture(),
        attempt_id: "sNHeiaNYiplPq62goZXUM",
        created_at: "2021-09-01T00:00:00.000Z",
      },
    });
  });
});
