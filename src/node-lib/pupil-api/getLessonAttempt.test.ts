import { LessonAttemptFixture } from "./__mocks__/fixtures/lesson-attempt.fixture";

import { datastore } from "./index";

jest.mock("@bugsnag/js");
jest.mock("@google-cloud/firestore");

describe("getLessonAttempt", () => {
  it("should fetch the lesson attempt by the attemptId", async () => {
    const { attempts } = await datastore.getLessonAttempt({
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
