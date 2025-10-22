import { LessonAttemptFixture } from "./__mocks__/fixtures/lesson-attempt.fixture";

import { datastore } from "./index";

jest.mock("@bugsnag/js");
jest.mock("@google-cloud/firestore");

describe("logLessonAttempt", () => {
  it("should add a lesson attempt log to the collection pupilLessonAttempts", async () => {
    const now = new Date();
    jest.useFakeTimers({ now });
    const result = await datastore.logLessonAttempt(LessonAttemptFixture());
    const data = {
      ...LessonAttemptFixture(),
      attempt_id: expect.any(String),
      created_at: now.toISOString(),
    };
    expect(result).toEqual(data);

    jest.useRealTimers();
  });
});
