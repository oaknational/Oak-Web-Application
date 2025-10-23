import { LessonAttemptFixture } from "@/node-lib/pupil-api/__mocks__/fixtures/lesson-attempt.fixture";
import { pupilDatastore } from "@/node-lib/pupil-api/pupilDataStore";

jest.mock("@bugsnag/js");
jest.mock("@google-cloud/firestore");

describe("logLessonAttempt", () => {
  it("should add a lesson attempt log to the collection pupilLessonAttempts", async () => {
    const now = new Date();
    jest.useFakeTimers({ now });
    const result = await pupilDatastore.logLessonAttempt(
      LessonAttemptFixture(),
    );
    const data = {
      ...LessonAttemptFixture(),
      attempt_id: expect.any(String),
      created_at: now.toISOString(),
    };
    expect(result).toEqual(data);

    jest.useRealTimers();
  });
});
